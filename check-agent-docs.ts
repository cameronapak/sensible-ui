import assert from "node:assert/strict";
import { posix } from "node:path";
import app from "./src/app.tsx";
import { agentDocuments } from "./src/agent-docs.ts";
import { version, exports as packageExports } from "./package.json";

const skillRoot = "skills/using-sensible-ui";
const skill = await Bun.file(`${skillRoot}/SKILL.md`).text();
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/);
assert(frontmatter, "SKILL.md needs YAML frontmatter");
const metadata = Bun.YAML.parse(frontmatter[1]) as {
  name: string;
  description: string;
};
assert.equal(metadata.name, "using-sensible-ui");
assert(metadata.description.length > 0 && metadata.description.length <= 1024);
assert(skill.split("\n").length < 500, "Keep the entry skill small");

const pack = Bun.spawnSync([
  "npm",
  "pack",
  "--dry-run",
  "--json",
  "--ignore-scripts",
]);
assert.equal(pack.exitCode, 0, pack.stderr.toString());
const packed = new Set<string>(
  JSON.parse(pack.stdout.toString())[0].files.map(
    (file: { path: string }) => file.path,
  ),
);

for (const [url, path] of Object.entries(agentDocuments)) {
  const source = await Bun.file(path).text();
  const response = await app.request(url);
  assert.equal(response.status, 200, url);
  assert.equal(
    await response.text(),
    source,
    `${url} must serve plain source, not an HTML shell`,
  );
  assert.equal(
    response.headers.get("Content-Type"),
    `${url.endsWith(".txt") ? "text/plain" : "text/markdown"}; charset=utf-8`,
  );
  assert.equal(response.headers.get("Link"), '</llms.txt>; rel="describedby"');
  assert.equal(
    await Bun.file(`dist/static${url}`).text(),
    source,
    `${url} static output differs`,
  );
  if (url !== "/agents.md")
    assert(packed.has(path), `${path} missing from npm package`);

  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (target.startsWith("https://sensibleui.com/")) {
      const pathname = new URL(target).pathname;
      assert.equal(
        (await app.request(pathname)).status,
        200,
        `Broken website link: ${target}`,
      );
    } else if (!/^https?:/.test(target)) {
      const resolved = posix.normalize(posix.join(posix.dirname(path), target));
      assert(
        await Bun.file(resolved).exists(),
        `Broken document link: ${path} -> ${target}`,
      );
      if (path.startsWith(skillRoot)) {
        assert(
          resolved.startsWith(`${skillRoot}/`),
          "Installed skills must be self-contained",
        );
        assert(
          packed.has(resolved),
          `Linked skill resource missing from npm: ${resolved}`,
        );
      }
    }
  }
}

const components = await Bun.file(
  `${skillRoot}/references/components.md`,
).text();
assert(components.includes(`Package version: ${version}.`));
for (const match of components.matchAll(
  /(?:CSS import|JavaScript import): `@faith-tools\/sensible-ui\/([^`]+)`/g,
)) {
  assert(
    `./${match[1]}` in packageExports,
    `Documented import does not exist: ${match[1]}`,
  );
}
for (const html of [
  await (await app.request("/")).text(),
  await Bun.file("dist/static/index.html").text(),
]) {
  assert(
    html.includes('<link rel="describedby" href="/llms.txt"'),
    "Missing agent index discovery link",
  );
}
assert(
  !packed.has("AGENTS.md"),
  "Contributor instructions must not be installed as consumer guidance",
);
console.log(
  `Verified ${Object.keys(agentDocuments).length} agent documents: links, HTTP, static parity, npm contents, and imports`,
);
