import { expect, test } from "@playwright/test";

const source = '<button type="button">Save</button>\n<p>Ready & waiting</p>';

test("highlights and copies the original source", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await page
    .locator("#code > sensible-code")
    .first()
    .evaluate((node) => {
      node.id = "primary-code";
    });
  const element = page.locator("#primary-code");
  const code = element.locator("pre code");
  await expect(code).toHaveText(source, { useInnerText: false });
  await expect(code.locator(".sh__token--entity").first()).toHaveText("button");
  await expect(element.locator(".sensible-code-toolbar span")).toHaveText(
    "HTML",
  );
  const copyButton = element.getByRole("button", { name: "Copy code" });
  const wrapButton = element.getByRole("button", { name: "Wrap lines" });
  await expect(copyButton).toHaveAttribute("data-size", "sm");
  await expect(wrapButton).toHaveAttribute("data-size", "sm");
  await expect(copyButton).toHaveAttribute("data-variant", "outline");
  await expect(wrapButton).toHaveAttribute("data-variant", "outline");
  await expect(copyButton).toHaveCSS("height", "32px");
  await expect(wrapButton).toHaveCSS("height", "32px");
  await expect(copyButton).toHaveCSS("padding-left", "12px");
  await expect(copyButton).toHaveCSS("font-size", "14px");
  await expect(copyButton).toHaveCSS("border-radius", "8px");
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

test("switches each block between scrolling and wrapping at narrow widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const scrolling = page.locator("#code > sensible-code").first();
  const wrapped = page.locator("#code > sensible-code").last();
  const longLine = "const path = '" + "long-segment/".repeat(20) + "';";
  await scrolling.evaluate((node, source) => {
    node.querySelector("pre code")!.textContent = source;
    node.style.width = "280px";
  }, longLine);
  await wrapped.evaluate((node) => {
    node.style.width = "280px";
  });

  const scrollPre = scrolling.locator("pre");
  const wrapPre = wrapped.locator("pre");
  const scrollButton = scrolling.getByRole("button", { name: "Wrap lines" });
  const wrapButton = wrapped.getByRole("button", { name: "Wrap lines" });
  const dimensions = (node: HTMLElement) => ({
    scrollWidth: node.scrollWidth,
    clientWidth: node.clientWidth,
    height: node.clientHeight,
  });

  await expect(scrollButton).toHaveAttribute("aria-pressed", "false");
  await expect(wrapButton).toHaveAttribute("aria-pressed", "true");
  await expect(scrollButton).toHaveAttribute("data-variant", "outline");
  await expect(wrapButton).toHaveAttribute("data-variant", "primary");
  const before = await scrollPre.evaluate(dimensions);
  expect(before.scrollWidth).toBeGreaterThan(before.clientWidth);
  const wrappedBefore = await wrapPre.evaluate(dimensions);
  expect(wrappedBefore.scrollWidth).toBeLessThanOrEqual(
    wrappedBefore.clientWidth,
  );
  expect(wrappedBefore.height).toBeGreaterThan(before.height);

  await scrollButton.click();
  await expect(scrolling).toHaveAttribute("data-wrap", "true");
  await expect(scrollButton).toHaveAttribute("aria-pressed", "true");
  await expect(scrollButton).toHaveAttribute("data-variant", "primary");
  const after = await scrollPre.evaluate(dimensions);
  expect(after.scrollWidth).toBeLessThanOrEqual(after.clientWidth);
  expect(after.height).toBeGreaterThan(before.height);
  await expect(wrapButton).toHaveAttribute("aria-pressed", "true");

  await wrapButton.click();
  await expect(wrapped).not.toHaveAttribute("data-wrap", "true");
  await expect(wrapButton).toHaveAttribute("aria-pressed", "false");
  await expect(wrapButton).toHaveAttribute("data-variant", "outline");
  const toolbarColor = await wrapped
    .locator(".sensible-code-toolbar")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await expect(wrapButton).toHaveCSS("background-color", toolbarColor);
  expect((await wrapPre.evaluate(dimensions)).scrollWidth).toBeGreaterThan(
    wrappedBefore.clientWidth,
  );
});

test("resets code scroll position whenever wrapping changes", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const element = document.createElement("sensible-code");
    element.id = "overflow-code";
    element.style.width = "280px";
    const textarea = document.createElement("textarea");
    textarea.readOnly = true;
    textarea.textContent = Array.from(
      { length: 12 },
      (_, index) => `${index}: ${"long-segment/".repeat(20)}`,
    ).join("\n");
    element.append(textarea);
    document.querySelector("#code")?.append(element);
  });

  const element = page.locator("#overflow-code");
  const pre = element.locator("pre");
  const toggle = element.getByRole("button", { name: "Wrap lines" });
  await expect(pre).toBeVisible();
  await pre.evaluate((node) => {
    node.style.maxHeight = "80px";
    node.scrollLeft = 160;
    node.scrollTop = 60;
  });
  expect(await pre.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  expect(await pre.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await pre.evaluate((node) => node.scrollLeft)).toBe(0);
  expect(await pre.evaluate((node) => node.scrollTop)).toBe(0);

  await pre.evaluate((node) => {
    node.scrollTop = 60;
  });
  expect(await pre.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await element.evaluate((node) => node.setAttribute("data-wrap", "true"));
  expect(await pre.evaluate((node) => node.scrollTop)).toBe(60);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(await pre.evaluate((node) => node.scrollLeft)).toBe(0);
  expect(await pre.evaluate((node) => node.scrollTop)).toBe(0);

  await pre.evaluate((node) => {
    node.scrollTop = 60;
  });
  await element.evaluate((node) => node.setAttribute("data-wrap", "false"));
  expect(await pre.evaluate((node) => node.scrollTop)).toBe(60);
});

test("keeps toolbar controls visible in a narrow code block", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const example = page.locator("#code ol .docs-example sensible-code").first();
  await expect(example.locator("pre")).toHaveCSS("white-space", "pre");
  const block = page.locator("#code ol .docs-example sensible-code").nth(1);
  await block.evaluate((node) => {
    node.style.width = "200px";
  });
  const copyButton = block.getByRole("button", { name: "Copy code" });
  await expect(copyButton).toBeVisible();
  const buttonsFit = () =>
    block.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return Array.from(
        node.querySelectorAll(".sensible-code-toolbar button"),
      ).every((button) => {
        const rect = button.getBoundingClientRect();
        return rect.left >= bounds.left && rect.right <= bounds.right;
      });
    });
  expect(await buttonsFit()).toBe(true);

  await copyButton.evaluate((node) => {
    node.textContent = "Copy failed";
  });
  expect(await buttonsFit()).toBe(true);
});

test("keeps source readable before the optional script loads", async ({
  page,
}) => {
  await page.route("**/code.js", (route) => route.abort());
  await page.goto("/");

  const element = page.locator("#code > sensible-code").first();
  await expect(element.locator("textarea[readonly]")).toHaveText(source, {
    useInnerText: false,
  });
  await expect(element.locator("textarea")).toBeVisible();
  await expect(element.locator("pre code")).toHaveCount(0);
  await expect(element.locator(".sensible-code-toolbar")).toHaveCount(0);
  const wrapped = page.locator("#code > sensible-code[data-wrap='true']");
  await expect(wrapped.locator("textarea")).toHaveCSS(
    "white-space",
    "pre-wrap",
  );
  await expect(wrapped.locator("textarea")).toHaveCSS(
    "overflow-wrap",
    "anywhere",
  );
  await wrapped.evaluate((node) => {
    node.style.width = "280px";
  });
  const fallbackSize = await wrapped.locator("textarea").evaluate((node) => ({
    scrollWidth: node.scrollWidth,
    clientWidth: node.clientWidth,
  }));
  expect(fallbackSize.scrollWidth).toBeLessThanOrEqual(
    fallbackSize.clientWidth,
  );

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
  const copyButton = element.getByRole("button", { name: "Copy code" });
  const wrapButton = element.getByRole("button", { name: "Wrap lines" });
  await expect(copyButton).toHaveAttribute("data-size", "sm");
  await expect(wrapButton).toHaveAttribute("data-size", "sm");
  await expect(copyButton).toHaveAttribute("data-variant", "outline");
  await expect(wrapButton).toHaveAttribute("data-variant", "outline");
  await expect(copyButton).toHaveCSS("height", "32px");
  await expect(wrapButton).toHaveCSS("height", "32px");
  await expect(copyButton).toHaveCSS("padding-left", "12px");
  await expect(copyButton).toHaveCSS("font-size", "14px");
  await expect(copyButton).toHaveCSS("border-radius", "8px");
  await wrapButton.click();
  await expect(wrapButton).toHaveAttribute("data-variant", "primary");
  await expect(wrapButton).toHaveAttribute("aria-pressed", "true");
  expect(
    await wrapButton.evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe(
    await copyButton.evaluate((node) => getComputedStyle(node).backgroundColor),
  );

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

  const button = page.getByRole("button", { name: "Copy code" });
  await expect(button).toHaveAttribute("data-size", "sm");
  await expect(button).toHaveAttribute("data-variant", "outline");
  await expect(button).toHaveCSS("height", "32px");
  await expect(button).toHaveCSS("padding-left", "12px");
  await expect(button).toHaveCSS("font-size", "14px");
  await expect(button).toHaveCSS("background-color", "oklch(1 0 0)");
});
