import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const radii = (
  page: import("@playwright/test").Page,
  selector: string,
) =>
  page.locator(selector).evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      startStart: style.borderStartStartRadius,
      startEnd: style.borderStartEndRadius,
      endStart: style.borderEndStartRadius,
      endEnd: style.borderEndEndRadius,
      inlineStart: style.borderInlineStartWidth,
      blockStart: style.borderBlockStartWidth,
    };
  });

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: button groups join children without JavaScript`, async ({
    page,
  }) => {
    await page.setContent(`<section class="sensible-ui" style="width: 480px">
      <sensible-button-group id="row" role="group" aria-label="Actions">
        <button data-variant="outline">One</button>
        <button data-variant="outline">Two</button>
        <button data-variant="outline">Three</button>
      </sensible-button-group>
      <sensible-button-group id="column" orientation="vertical">
        <button data-variant="outline">Up</button>
        <button data-variant="outline">Down</button>
      </sensible-button-group>
      <sensible-button-group id="nested">
        <sensible-button-group><button data-variant="outline">A</button></sensible-button-group>
        <sensible-button-group><button data-variant="outline">B</button><button data-variant="outline">C</button></sensible-button-group>
      </sensible-button-group>
      <sensible-button-group id="search">
        <input aria-label="Query"><button data-variant="outline">Go</button>
      </sensible-button-group>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    expect(
      await page.evaluate(() => customElements.get("sensible-button-group")),
    ).toBeUndefined();
    await expect(
      page.getByRole("group", { name: "Actions" }).getByRole("button"),
    ).toHaveCount(3);

    expect(await radii(page, "#row > :first-child")).toMatchObject({
      startStart: "8px",
      startEnd: "0px",
      inlineStart: "1px",
    });
    expect(await radii(page, "#row > :nth-child(2)")).toMatchObject({
      startStart: "0px",
      startEnd: "0px",
      endStart: "0px",
      endEnd: "0px",
      inlineStart: "0px",
    });
    expect(await radii(page, "#row > :last-child")).toMatchObject({
      startStart: "0px",
      startEnd: "8px",
      endEnd: "8px",
    });

    expect(await radii(page, "#column > :first-child")).toMatchObject({
      startStart: "8px",
      startEnd: "8px",
      endStart: "0px",
      blockStart: "1px",
    });
    expect(await radii(page, "#column > :last-child")).toMatchObject({
      startStart: "0px",
      startEnd: "0px",
      endEnd: "8px",
      blockStart: "0px",
      inlineStart: "1px",
    });

    // Nested groups keep their own outer corners and sit apart.
    await expect(page.locator("#nested")).toHaveCSS("column-gap", "8px");
    expect(await radii(page, "#nested > :last-child > :first-child")).toMatchObject(
      { startStart: "8px", inlineStart: "1px" },
    );

    const input = (await page.locator("#search > input").boundingBox())!;
    const action = (await page.locator("#search > button").boundingBox())!;
    expect(input.width + action.width).toBeCloseTo(480, 0);
    expect(input.height).toBe(action.height);

    await page.locator("#row > :nth-child(2)").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator("#row > :nth-child(2)")).toBeFocused();
    await expect(page.locator("#row > :nth-child(2)")).toHaveCSS("z-index", "1");
    await expect(page.locator("#row > :first-child")).toHaveCSS("z-index", "auto");
  });
}

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: button groups keep long, hidden, wrapped, and RTL children usable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.setContent(`<main class="sensible-ui" style="padding: 16px">
      <sensible-button-group id="long">
        <button data-variant="outline">Archivieren</button>
        <button data-variant="outline">Als Spam melden</button>
        <button data-variant="outline">Aleksandra Wiśniewska-Kowalczyk zuweisen</button>
      </sensible-button-group>
      <sensible-button-group id="prefix">
        <span>https://northwind-industries-holdings.example.com/</span><input aria-label="Path">
      </sensible-button-group>
      <sensible-button-group id="search">
        <input type="search" aria-label="Search the docs"><button data-variant="outline">Search</button>
      </sensible-button-group>
      <sensible-button-group id="check">
        <input type="checkbox" aria-label="Select all"><button data-variant="outline">More</button>
      </sensible-button-group>
      <sensible-button-group id="hidden">
        <button hidden>Undo</button><button data-variant="outline">Redo</button>
        <button data-variant="outline">Save</button><input type="hidden" name="draft">
      </sensible-button-group>
      <sensible-button-group id="tips">
        <sensible-tooltip><button data-variant="outline">B</button><span role="tooltip">Bold</span></sensible-tooltip>
        <sensible-tooltip><button data-variant="outline">I</button><span role="tooltip">Italic</span></sensible-tooltip>
      </sensible-button-group>
      <sensible-button-group id="nested">
        <sensible-button-group><button data-variant="outline">A</button></sensible-button-group>
        <button data-variant="outline">After</button>
      </sensible-button-group>
      <sensible-button-group id="invalid">
        <button data-variant="outline">To</button><input aria-label="Email" aria-invalid="true">
      </sensible-button-group>
      <sensible-button-group id="vertical" orientation="vertical">
        <button data-variant="outline" data-size="icon" aria-label="Up">^</button>
        <button data-variant="outline">Longer text</button>
        <input aria-label="Name">
        <sensible-tooltip><button data-variant="outline" data-size="icon" aria-label="Add">+</button><span role="tooltip">Add</span></sensible-tooltip>
      </sensible-button-group>
      <div dir="rtl"><div dir="ltr"><div dir="rtl">
        <sensible-button-group id="rtl">
          <button data-variant="outline">One</button><button data-variant="outline">Two</button>
        </sensible-button-group>
      </div></div></div>
    </main>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    // A row longer than its container wraps, and nothing leaves the main
    // element. The group does not clip, so positioned badges and menus show.
    const outside = await page.evaluate(() => {
      const edge = document.querySelector("main")!.getBoundingClientRect().right - 16;
      return Array.from(document.querySelectorAll("sensible-button-group *"))
        .filter((node) => node.getBoundingClientRect().right > edge + 0.5)
        .map((node) => node.textContent);
    });
    expect(outside).toEqual([]);
    await expect(page.locator("#long")).toHaveCSS("overflow-x", "visible");

    expect((await page.locator("#prefix > input").boundingBox())!.width).toBeGreaterThanOrEqual(128);
    // A field and its action share one row when the field can keep 8rem.
    const field = (await page.locator("#search > input").boundingBox())!;
    const action = (await page.locator("#search > button").boundingBox())!;
    expect(action.y).toBe(field.y);
    expect((await page.locator("#check > input").boundingBox())!.width).toBeLessThan(20);

    expect(await radii(page, "#hidden > :nth-child(2)")).toMatchObject({
      startStart: "8px",
      inlineStart: "1px",
    });
    expect(await radii(page, "#hidden > :nth-child(3)")).toMatchObject({
      endEnd: "8px",
    });
    expect((await page.locator("#hidden").boundingBox())!.width).toBeLessThan(200);

    expect(await radii(page, "#tips > :first-child > button")).toMatchObject({
      startStart: "8px",
      startEnd: "0px",
    });
    expect(await radii(page, "#tips > :last-child > button")).toMatchObject({
      startStart: "0px",
      endEnd: "8px",
      inlineStart: "0px",
    });

    expect(await radii(page, "#nested > button")).toMatchObject({
      startStart: "8px",
      inlineStart: "1px",
    });
    await expect(page.locator("#invalid > input")).toHaveCSS(
      "border-inline-start-color",
      // WebKit serializes the hue as 27.325001.
      /oklch\(0\.577 0\.245 27\.325/,
    );
    expect(await radii(page, "#invalid > input")).toMatchObject({
      inlineStart: "1px",
    });

    const up = (await page.locator("#vertical > :first-child").boundingBox())!;
    const text = (await page.locator("#vertical > button:last-of-type").boundingBox())!;
    expect(up.width).toBe(text.width);
    // A field in a column keeps its own height.
    expect((await page.locator("#vertical > input").boundingBox())!.height).toBe(36);
    expect((await page.locator("#vertical button[aria-label=Add]").boundingBox())!.width).toBe(up.width);

    // In a right-to-left part of a left-to-right part of a right-to-left page,
    // with no lang, the first child rounds its right corners.
    await expect(page.locator("#rtl > :first-child")).toHaveCSS(
      "border-top-right-radius",
      "8px",
    );
    await expect(page.locator("#rtl > :first-child")).toHaveCSS(
      "border-top-left-radius",
      "0px",
    );
  });
}

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: input groups draw one field around icons, text, and actions`, async ({
    page,
  }) => {
    await page.setContent(`<section class="sensible-ui" style="width: 320px">
      <sensible-input-group id="search">
        <svg aria-hidden="true" viewBox="0 0 24 24"></svg>
        <input aria-label="Search">
        <button data-variant="ghost" data-size="icon" aria-label="Clear">x</button>
      </sensible-input-group>
      <sensible-input-group id="invalid"><input aria-label="Name" aria-invalid="true"></sensible-input-group>
      <sensible-input-group id="disabled"><input aria-label="Off" disabled></sensible-input-group>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    const group = page.locator("#search");
    const input = page.getByRole("textbox", { name: "Search" });
    await expect(group).toHaveCSS("height", "36px");
    await expect(input).toHaveCSS("border-top-width", "0px");
    await expect(input).toHaveCSS("box-shadow", "none");
    const field = (await group.boundingBox())!;
    const clear = (await page.getByRole("button", { name: "Clear" }).boundingBox())!;
    expect(clear.height).toBe(24);
    expect(clear.x + clear.width).toBeLessThan(field.x + field.width);

    await expect(group).toHaveCSS("box-shadow", /0px 1px 2px/);
    await page.keyboard.press("Tab");
    await expect(input).toBeFocused();
    await expect(group).toHaveCSS("box-shadow", /0px 0px 0px 3px/);
    await expect(input).toHaveCSS("box-shadow", "none");

    await expect(page.locator("#invalid")).toHaveCSS(
      "border-top-color",
      // WebKit serializes the hue as 27.325001.
      /oklch\(0\.577 0\.245 27\.325/,
    );
    await expect(page.locator("#disabled")).toHaveCSS("opacity", "0.5");
    await expect(group).toHaveCSS("cursor", "auto");
  });
}

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: input groups fit long addons and keep focus, invalid, and disabled states`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.setContent(`<main class="sensible-ui" style="padding: 16px">
      <sensible-input-group id="domain">
        <span>https://</span><input aria-label="Subdomain" value="aleksandra">
        <span>.northwind-industries-holdings.example.com</span>
      </sensible-input-group>
      <sensible-input-group id="prefix"><span>https://</span><input aria-label="Site"></sensible-input-group>
      <sensible-input-group id="long-prefix">
        <span>https://northwind-industries-holdings.example.com/</span><input aria-label="Path">
      </sensible-input-group>
      <sensible-input-group id="prefix-count">
        <span>https://northwind-industries-holdings.example.com/</span><input aria-label="Page">
        <output>1,284 results</output>
      </sensible-input-group>
      <sensible-input-group id="money">
        <span>CHF</span><input aria-label="Amount" placeholder="0.00">
        <span>pro Monat inklusive Mehrwertsteuer</span>
      </sensible-input-group>
      <sensible-input-group id="password">
        <input type="password" aria-label="Password"><button data-size="sm">Anzeigen</button>
        <button data-variant="outline" data-size="sm">Generate strong password</button>
      </sensible-input-group>
      <sensible-input-group id="message">
        <textarea aria-label="Message"></textarea>
        <div class="split">
          <span>Replying to bartholomew.fitzgerald@northwind-industries-holdings.example.com</span>
          <button data-size="icon" aria-label="Send">^</button>
        </div>
      </sensible-input-group>
      <sensible-input-group id="compose">
        <textarea aria-label="Prompt"></textarea>
        <div class="split">
          <div class="x-stack"><button data-variant="ghost" data-size="sm">Claude Opus 5.5 (Extended thinking)</button></div>
          <button data-size="icon" aria-label="Submit">^</button>
        </div>
      </sensible-input-group>
      <sensible-input-group id="count">
        <input aria-label="Find" value="sidebar"><output>1,284 results</output>
        <button data-variant="ghost" data-size="icon" aria-label="Clear">x</button>
      </sensible-input-group>
      <sensible-input-group id="invalid"><span>@</span><input aria-label="User" aria-invalid="true"></sensible-input-group>
      <sensible-input-group id="disabled"><input aria-label="Off" disabled></sensible-input-group>
      <sensible-input-group id="actions">
        <input aria-label="Query"><button data-variant="outline">Search all</button>
        <button data-variant="ghost" data-size="icon" aria-label="Copy">c</button>
      </sensible-input-group>
    </main>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    const overflowing = await page.evaluate(() =>
      Array.from(document.querySelectorAll("sensible-input-group")).flatMap((group) => {
        const edge = group.getBoundingClientRect().right;
        return Array.from(group.querySelectorAll("*"))
          .filter((node) => node.getBoundingClientRect().right > edge + 0.5)
          .map((node) => `${group.id} ${node.tagName.toLowerCase()}`);
      }),
    );
    expect(overflowing).toEqual([]);
    expect((await page.locator("#domain > input").boundingBox())!.width).toBe(64);
    // Prefixes stay whole; text after the field gives way first.
    for (const prefix of ["#prefix > span", "#money > span:first-child"]) {
      expect(
        await page.locator(prefix).evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true);
    }
    expect(
      await page
        .getByRole("textbox", { name: "Amount" })
        .evaluate((node) => getComputedStyle(node, "::placeholder").color),
    ).toBe("oklch(0.556 0 0)");
    const footer = (await page.locator("#message span").boundingBox())!;
    const send = (await page.getByRole("button", { name: "Send" }).boundingBox())!;
    expect(send.x).toBeGreaterThan(footer.x + footer.width);
    // Counts stay whole, even beside a long prefix, and icon buttons keep
    // their square.
    for (const count of ["#count > output", "#prefix-count > output"]) {
      expect(
        await page.locator(count).evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true);
    }
    expect((await page.getByRole("button", { name: "Clear" }).boundingBox())!.width).toBe(24);

    await page.getByRole("textbox", { name: "User" }).focus();
    await expect(page.locator("#invalid")).toHaveCSS(
      "border-top-color",
      // WebKit serializes the hue as 27.325001.
      /oklch\(0\.577 0\.245 27\.325/,
    );
    await expect(page.getByRole("textbox", { name: "Off" })).toHaveCSS("opacity", "1");
    expect((await page.getByRole("button", { name: "Search all" }).boundingBox())!.height).toBe(24);
    await page.getByRole("button", { name: "Search all" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Copy" })).toHaveCSS(
      "box-shadow",
      /0px 0px 0px 3px/,
    );
  });
}

test("the optional input group script focuses the field from icons and text", async ({
  page,
}) => {
  // A focusable ancestor must not stop the group from focusing its field.
  await page.setContent(`<main tabindex="-1">
    <sensible-input-group>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
      <input aria-label="Search">
      <span>12 results</span>
      <button type="button" aria-label="Clear">x</button>
    </sensible-input-group></main>`);
  await page.addStyleTag({
    content: await readFile("dist/sensible-ui.css", "utf8"),
  });
  const input = page.getByRole("textbox", { name: "Search" });
  const results = page.getByText("12 results");

  await results.click();
  await expect(input).not.toBeFocused();

  const script = await readFile("dist/sensible-input-group.js", "utf8");
  await page.addScriptTag({ content: script, type: "module" });
  await page.addScriptTag({ content: script, type: "module" });
  await expect(page.locator("sensible-input-group")).toHaveCSS("cursor", "text");

  await results.click();
  await expect(input).toBeFocused();
  await page.locator("svg").click({ force: true });
  await expect(input).toBeFocused();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByRole("button", { name: "Clear" })).toBeFocused();
});

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: navigation elements lay out links and sidebars without JavaScript`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.setContent(`<section class="sensible-ui">
      <header><sensible-navbar>
        <strong>Acme</strong>
        <nav aria-label="Main"><ul>
          <li><a href="#a" aria-current="page">Home</a></li><li><a href="#b">Docs</a></li>
        </ul></nav>
      </sensible-navbar></header>
      <sensible-sidebar-layout id="layout">
        <aside><sensible-sidebar><nav aria-label="Sections">
          <h2>Guides</h2>
          <ul><li><a href="#c">One</a></li><li><a href="#d" aria-current="page">Two</a></li></ul>
          <ul><li><details open><summary>More</summary><ul><li><a href="#e">Three</a></li></ul></details></li></ul>
        </nav></sensible-sidebar></aside>
        <main><p>Content</p></main>
      </sensible-sidebar-layout>
      <sensible-sidebar-layout id="end" side="end">
        <main><p>Content</p></main>
        <aside><p>Sidebar</p></aside>
      </sensible-sidebar-layout>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    const box = async (locator: import("@playwright/test").Locator) =>
      (await locator.boundingBox())!;
    const main = page.getByRole("navigation", { name: "Main" });
    const home = await box(main.getByRole("link", { name: "Home" }));
    const docs = await box(main.getByRole("link", { name: "Docs" }));
    expect(docs.y).toBe(home.y);
    expect(docs.x).toBeGreaterThan(home.x + home.width);

    const sections = page.getByRole("navigation", { name: "Sections" });
    const one = await box(sections.getByRole("link", { name: "One" }));
    const two = await box(sections.getByRole("link", { name: "Two" }));
    expect(two.x).toBe(one.x);
    expect(two.y).toBeGreaterThan(one.y);
    const current = sections.getByRole("link", { name: "Two" });
    await expect(current).toHaveCSS("background-color", "oklch(0.97 0 0)");
    await expect(sections.getByRole("link", { name: "One" })).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(sections.getByRole("link", { name: "One" })).toHaveCSS(
      "text-decoration-line",
      "none",
    );
    await expect(page.locator("details")).toHaveCSS("border-top-width", "0px");
    await expect(page.getByText("More")).toHaveCSS("font-size", "14px");
    await page.getByText("More").click();
    await expect(sections.getByRole("link", { name: "Three" })).toBeHidden();
    // Closed groups leave the tab order.
    await sections.getByRole("link", { name: "Two" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByText("More")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator('a[href="#e"]')).not.toBeFocused();

    const aside = await box(page.locator("#layout > aside"));
    const content = await box(page.locator("#layout > main"));
    // The sidebar keeps about --sidebar-width; it takes 1/1000 of spare space.
    expect(aside.width).toBeGreaterThanOrEqual(256);
    expect(aside.width).toBeLessThan(258);
    expect(content.x).toBeGreaterThan(aside.x + aside.width);
    expect(content.y).toBe(aside.y);
    const endMain = await box(page.locator("#end > main"));
    const endAside = await box(page.locator("#end > aside"));
    expect(endAside.width).toBeGreaterThanOrEqual(256);
    expect(endAside.width).toBeLessThan(258);
    expect(endAside.x).toBeGreaterThan(endMain.x + endMain.width);

    await page.setViewportSize({ width: 375, height: 800 });
    const stackedAside = await box(page.locator("#layout > aside"));
    const stackedContent = await box(page.locator("#layout > main"));
    expect(stackedContent.x).toBe(stackedAside.x);
    expect(stackedContent.width).toBe(stackedAside.width);
    expect(stackedContent.y).toBeGreaterThan(stackedAside.y + stackedAside.height);
  });
}

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: navigation wraps long links and stays inside narrow screens and cards`, async ({
    page,
  }) => {
    const icon = `<svg aria-hidden="true" viewBox="0 0 24 24"></svg>`;
    await page.setViewportSize({ width: 320, height: 800 });
    await page.setContent(`<main class="sensible-ui" style="padding: 16px">
      <header><sensible-navbar id="bar">
        <a href="#" id="brand"><img width="32" height="32" alt=""> Acme Studio</a>
        <nav aria-label="Main"><ul>
          <li><a href="#a" aria-current="page">Overview</a></li><li><a href="#b">Pricing</a></li>
          <li><a href="#c">Docs</a></li><li><a href="#d">Blog</a></li><li><a href="#e">Support</a></li>
          <li><a href="#f">partnersupport@northwindholdings.example.com</a></li>
          <li><a href="#m">Neu: <strong>Dokumentation und API-Referenz für Partner</strong></a></li>
        </ul></nav>
      </sensible-navbar></header>
      <sensible-sidebar id="side"><nav aria-label="Sections">
        <h2>Guides</h2>
        <ul>
          <li><a href="#g">${icon}<span>bartholomew.fitzgerald@northwind-industries-holdings.example.com</span></a></li>
          <li><a href="#h">${icon}<span>Ausstehende Einladungen</span><span class="badge">1,284</span></a></li>
          <li><details><summary id="forms">${icon} Forms</summary>
            <ul><li><a href="#i" aria-current="page">Input</a></li></ul></details></li>
          <li><details open><summary id="auth"><span>Authentication</span></summary>
            <ul><li><a href="#j">Login</a></li></ul></details></li>
          <li><a href="#k"><strong>New:</strong> Sidebar layout with collapsible groups</a></li>
          <li><a href="#n"><code>useSidebarLayoutBreakpointObserver</code></a></li>
          <li><a href="#o">${icon}<span>Suchen in allen Arbeitsbereichen und Projekten</span><kbd>⌘K</kbd></a></li>
          <li><details><summary id="billing"><h3>Billing, invoices, and payment methods</h3></summary>
            <ul><li><a href="#l">Invoices</a></li></ul></details></li>
        </ul>
      </nav></sensible-sidebar>
      <div class="card"><section>
        <sensible-sidebar-layout id="card-layout"><aside>Side</aside><div>Content</div></sensible-sidebar-layout>
      </section></div>
      <sensible-sidebar-layout id="three"><aside>Nav</aside><div>Main</div><aside>On this page</aside></sensible-sidebar-layout>
    </main>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    const outside = await page.evaluate(() =>
      ["#bar", "#side"].flatMap((selector) => {
        const container = document.querySelector(selector)!.getBoundingClientRect();
        return Array.from(document.querySelectorAll(`${selector} *`))
          .filter((node) => node.getBoundingClientRect().right > container.right + 0.5)
          .map((node) => `${selector} ${node.tagName.toLowerCase()}`);
      }),
    );
    expect(outside).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

    await expect(page.locator("#brand")).toHaveCSS("text-decoration-line", "none");
    await expect(page.locator('a[href="#a"]')).toHaveCSS("font-weight", "600");
    // A summary with an icon keeps its chevron on the same row.
    expect((await page.locator("#forms").boundingBox())!.height).toBe(32);
    // A closed group that holds the current page marks its summary.
    await expect(page.locator("#forms")).toHaveCSS("font-weight", "600");
    await expect(page.locator("#auth > span")).toHaveCSS("font-size", "14px");
    // Headings in a summary read as the toggle, not as a group heading.
    expect(
      await page.locator("#billing").evaluate(
        (node) => getComputedStyle(node.firstElementChild!).color === getComputedStyle(node).color,
      ),
    ).toBe(true);
    // A shortcut hint keeps its size beside a wrapping label.
    expect(
      await page.locator('a[href="#o"] > kbd').evaluate((node) => node.scrollHeight <= node.clientHeight),
    ).toBe(true);
    // A leading inline element flows with the label, so it keeps its word.
    expect(
      await page.locator('a[href="#k"] > strong').evaluate((node) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getClientRects().length;
      }),
    ).toBe(1);

    // Inside a card section, the layout still stacks instead of squeezing.
    const side = (await page.locator("#card-layout > aside").boundingBox())!;
    const content = (await page.locator("#card-layout > div").boundingBox())!;
    expect(content.y).toBeGreaterThan(side.y);
    expect(content.width).toBe(side.width);

    // Extra children take full rows instead of overflowing.
    const main = (await page.locator("#three > div").boundingBox())!;
    expect(main.x + main.width).toBeLessThanOrEqual(304);

    // Closing a group removes its links from the tab order at once.
    await page.locator("#auth").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(page.locator('a[href="#j"]')).not.toBeFocused();

    // Forced colors drop shadows, so focus also needs an outline.
    await page.emulateMedia({ forcedColors: "active" });
    await page.locator('a[href="#b"]').focus();
    await expect(page.locator('a[href="#b"]')).toHaveCSS("outline-style", "solid");
  });
}
