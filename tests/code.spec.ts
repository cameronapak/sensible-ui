import { expect, test } from "@playwright/test";

const source = '<button type="button">Save</button>\n<p>Ready & waiting</p>';

test("highlights and copies the original source", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const element = page.locator("#code > sensible-code");
  const code = element.locator("pre code");
  await expect(code).toHaveText(source, { useInnerText: false });
  await expect(code.locator(".sh__token--entity").first()).toHaveText("button");
  await expect(element.locator(".sensible-code-toolbar span")).toHaveText(
    "HTML",
  );
  const copyButton = element.getByRole("button", { name: "Copy code" });
  await expect(copyButton).toHaveCSS("padding", "4px 12px");
  await expect(copyButton).toHaveCSS("font-size", "12px");
  await expect(copyButton).toHaveCSS("background-color", "oklch(1 0 0)");

  await copyButton.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    source,
  );

  await page.evaluate(() =>
    navigator.clipboard.writeText("previous clipboard text"),
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("Clipboard API unavailable");
    };
  });
  await element.getByRole("button", { name: "Copy code" }).click();
  await expect(element.getByRole("button", { name: "Copy code" })).toHaveText(
    "Copied",
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    source,
  );

  await element.evaluate((node) => {
    node.remove();
    document.querySelector("#code")?.append(node);
  });
  await expect(element.locator(".sensible-code-toolbar")).toHaveCount(1);
  await expect(code).toHaveText(source, { useInnerText: false });
});

test("keeps source readable before the optional script loads", async ({
  page,
}) => {
  await page.route("**/code.js", (route) => route.abort());
  await page.goto("/");

  const element = page.locator("#code > sensible-code");
  await expect(element.locator("textarea[readonly]")).toHaveText(source, {
    useInnerText: false,
  });
  await expect(element.locator("textarea")).toBeVisible();
  await expect(element.locator("pre code")).toHaveCount(0);
  await expect(element.locator(".sensible-code-toolbar")).toHaveCount(0);

  await page.unroute("**/code.js");
  await page.addScriptTag({ url: "/code.js?upgrade=1", type: "module" });
  await expect(element.locator("textarea")).toHaveCount(0);
  await expect(element.locator("pre code")).toHaveText(source, {
    useInnerText: false,
  });
  await expect(element.locator(".sh__token--entity").first()).toHaveText(
    "button",
  );
  await expect(
    element.getByRole("button", { name: "Copy code" }),
  ).toBeVisible();
});

test("enhances children added after the element connects", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const element = document.createElement("sensible-code");
    element.setAttribute("language", "html");
    element.id = "late-code";
    document.querySelector("#code")?.append(element);
    const textarea = document.createElement("textarea");
    textarea.readOnly = true;
    element.append(textarea);
    textarea.textContent = "<b>Added later</b>";
  });

  const element = page.locator("#late-code");
  await expect(element.locator(".sh__token--entity")).toHaveText(["b", "b"]);
  await expect(
    element.getByRole("button", { name: "Copy code" }),
  ).toBeVisible();
});

test("waits for parser-created children when registered in the document head", async ({
  page,
}) => {
  await page.route("**/early-code", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><script src="/code.js"></script></head>
        <body><sensible-code language="html"><textarea readonly><b>Parsed later</b></textarea></sensible-code></body></html>`,
    }),
  );
  await page.goto("/early-code");

  const element = page.locator("sensible-code");
  await expect(element.locator(".sh__token--entity")).toHaveText(["b", "b"]);
  await expect(
    element.getByRole("button", { name: "Copy code" }),
  ).toBeVisible();
});

test("reads raw HTML without angle-bracket escaping and handles textarea terminators", async ({
  page,
}) => {
  await page.route("**/authored-code", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><script type="module" src="/code.js"></script></head>
        <body><sensible-code language="html"><textarea readonly><button data-label="Save">Save</button> &amp;copy; &lt;/textarea></textarea></sensible-code></body></html>`,
    }),
  );
  await page.goto("/authored-code");

  const element = page.locator("sensible-code");
  await expect(element.locator("pre code")).toHaveText(
    '<button data-label="Save">Save</button> &copy; </textarea>',
  );
  await expect(element.locator("button[data-label]")).toHaveCount(0);
  await expect(element.locator(".sensible-code-toolbar")).toBeVisible();
});

test("preserves carriage returns, whitespace, and exact copied source", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const source = "\n\talpha\r\nbeta\rgamma\n";
  await page.evaluate((value) => {
    const element = document.createElement("sensible-code");
    element.id = "line-endings-code";
    const textarea = document.createElement("textarea");
    textarea.readOnly = true;
    textarea.textContent = value;
    element.append(textarea);
    document.querySelector("#code")?.append(element);
  }, source);

  const element = page.locator("#line-endings-code");
  const code = element.locator("code");
  await expect(code.locator(".sh__line")).not.toHaveCount(0);
  expect(await code.evaluate((node) => node.textContent)).toBe(source);
  await element.getByRole("button", { name: "Copy code" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    source,
  );
});

test("escapes untrusted code and accepts language aliases", async ({
  page,
}) => {
  await page.goto("/");
  const source = 'print("<img src=x onerror=alert(1)> & ready")';
  await page.evaluate((value) => {
    const element = document.createElement("sensible-code");
    element.setAttribute("language", "py");
    const textarea = document.createElement("textarea");
    textarea.readOnly = true;
    textarea.textContent = value;
    element.append(textarea);
    document.querySelector("#code")?.append(element);
  }, source);

  const element = page.locator("#code sensible-code").last();
  await expect(element.locator("pre code")).toHaveText(source);
  await expect(element.locator(".sensible-code-toolbar span")).toHaveText(
    "PYTHON",
  );
  await expect(element.locator("img")).toHaveCount(0);
});

test("works with only the optional CSS and JavaScript entries", async ({
  page,
}) => {
  await page.route("**/standalone-code", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head>
      <link rel="stylesheet" href="/code.css">
      <script type="module" src="/code.js"></script>
    </head><body><sensible-code language="html"><textarea readonly><b>Ready</b></textarea></sensible-code></body></html>`,
    }),
  );
  await page.goto("/standalone-code");

  const element = page.locator("sensible-code");
  const code = element.locator("pre code");
  await expect(code).toHaveText("<b>Ready</b>");
  await expect(code.locator(".sh__token--entity")).toHaveText(["b", "b"]);
  await expect(
    element.getByRole("button", { name: "Copy code" }),
  ).toBeVisible();

  const pre = element.locator("pre");
  const light = await pre.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await element.evaluate((node) => node.classList.add("dark"));
  expect(
    await pre.evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe(light);
});

test("keeps the Copy button styling when optional CSS loads before core CSS", async ({
  page,
}) => {
  await page.route("**/code-first", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head>
      <link rel="stylesheet" href="/code.css">
      <link rel="stylesheet" href="/index.css">
      <script type="module" src="/code.js"></script>
    </head><body><sensible-code language="html"><textarea readonly><b>Ready</b></textarea></sensible-code></body></html>`,
    }),
  );
  await page.goto("/code-first");

  const button = page.locator("sensible-code .sensible-code-toolbar button");
  await expect(button).toHaveCSS("padding", "4px 12px");
  await expect(button).toHaveCSS("font-size", "12px");
  await expect(button).toHaveCSS("background-color", "oklch(1 0 0)");
});
