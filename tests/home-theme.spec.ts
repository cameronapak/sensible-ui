import { expect, test } from "@playwright/test";
import packageJson from "../package.json" with { type: "json" };

const { version } = packageJson;

test("toggles the gallery between light and dark themes", async ({ page }) => {
  await page.goto("/");

  const toggle = page.locator("[data-theme-toggle]");
  await expect(toggle).toHaveText("Dark mode");
  const background = () =>
    page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).backgroundColor);
  const lightBackground = await background();

  await toggle.click();
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(toggle).toHaveText("Light mode");
  expect(await background()).not.toBe(lightBackground);

  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass("dark");
  await expect(toggle).toHaveText("Dark mode");
  expect(await background()).toBe(lightBackground);
});

test("highlights HTML examples without changing their source or copied text", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const example = page.locator("#typography > .docs-example");
  const code = example.locator("sensible-code > pre > code");
  const source = `<article>
  <h1>A clear heading</h1>
  <p>Use <strong>semantic HTML</strong> for meaning and <em>emphasis</em>.</p>
  <blockquote>Good defaults should support the content.</blockquote>
  <p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search.</p>
  <pre><code>const greeting = "Hello";</code></pre>
</article>`;

  await expect(code).toHaveText(source, { useInnerText: false });
  await expect(code.locator(".sh__token--entity").first()).toHaveText(
    "article",
  );
  await expect(
    page.locator("#image .docs-example sensible-code > pre > code"),
  ).toContainText("?auto=format&fit=crop&w=960&q=80");

  const tokenColor = () =>
    code
      .locator(".sh__token--entity")
      .first()
      .evaluate((token) => getComputedStyle(token).color);
  const lightColor = await tokenColor();

  await example.getByRole("button", { name: "Copy code" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    source,
  );

  await page.locator("[data-theme-toggle]").click();
  expect(await tokenColor()).not.toBe(lightColor);
  await expect(code).toHaveText(source, { useInnerText: false });
});

test("highlights and copies the installation snippets in their own languages", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const snippets = [
    ["#getting-started", "CSS", "@import '@faith-tools/sensible-ui';"],
    [
      "#getting-started",
      "HTML",
      `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@${version}/dist/sensible-ui.min.css">`,
    ],
    ["#scoped-mode", "CSS", "@import '@faith-tools/sensible-ui/scoped';"],
    [
      "#scoped-mode",
      "HTML",
      `<section class="sensible-ui">
  <h2>Account settings</h2>
  <label for="display-name">Display name</label>
  <input id="display-name">
  <button>Save changes</button>
</section>`,
    ],
  ] as const;

  for (const [index, [section, language, source]] of snippets.entries()) {
    const example = page.locator(`${section} > .docs-code-only`).nth(index % 2);
    await expect(example.locator(".sensible-code-toolbar span")).toHaveText(
      language,
    );
    await expect(example.locator(".docs-preview")).toHaveCount(0);
    await expect(example.locator("sensible-code > pre > code")).toHaveText(
      source,
      {
        useInnerText: false,
      },
    );
    await expect(
      example.locator(".sh__token--string, .sh__token--entity").first(),
    ).toBeVisible();

    await example.getByRole("button", { name: "Copy code" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      source,
    );
  }
});

test("documents the optional code component imports and markup", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("#code");
  await expect(section.locator("ol > li")).toHaveCount(3);
  await expect(section.locator("ol .sensible-code-toolbar span")).toHaveText([
    "CSS",
    "JAVASCRIPT",
    "HTML",
  ]);
  await expect(
    section.locator("ol .docs-example sensible-code > pre > code"),
  ).toHaveText(
    [
      "@import '@faith-tools/sensible-ui/code/css';",
      "import '@faith-tools/sensible-ui/code';",
      `<sensible-code language="html">\n  <textarea readonly><button>Save</button></textarea>\n</sensible-code>`,
    ],
    { useInnerText: false },
  );
  await expect(
    section.locator(":scope > sensible-code .sh__token--entity").first(),
  ).toHaveText("button");
});

test("lets visitors select part of a code block", async ({ page }) => {
  await page.goto("/");

  const code = page.locator(
    "#buttons .docs-example sensible-code > pre > code",
  );
  const token = code.locator(".sh__token--entity").first();
  await token.scrollIntoViewIfNeeded();
  await expect(code).toHaveCSS("user-select", "text");
  const box = await token.boundingBox();
  if (!box) throw new Error("The code token must be visible");

  await page.mouse.move(box.x + 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2, {
    steps: 5,
  });
  await page.mouse.up();

  const selected = await page.evaluate(() => getSelection()?.toString() ?? "");
  expect(selected.length).toBeGreaterThan(0);
  expect(selected.length).toBeLessThan(10);
  expect(
    await page
      .locator(".docs-page pre code")
      .evaluateAll((codes) =>
        codes.every(
          (element) => getComputedStyle(element).userSelect === "text",
        ),
      ),
  ).toBe(true);
});
