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
      </sensible-button-group>
      <div dir="rtl">
        <sensible-button-group id="rtl">
          <button data-variant="outline">One</button><button data-variant="outline">Two</button>
        </sensible-button-group>
      </div>
    </main>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    // A row longer than its container scrolls inside the group.
    const long = page.locator("#long");
    expect(
      await long.evaluate((node) => node.scrollWidth > node.clientWidth),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);

    expect((await page.locator("#prefix > input").boundingBox())!.width).toBe(128);
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
      "oklch(0.577 0.245 27.325)",
    );
    expect(await radii(page, "#invalid > input")).toMatchObject({
      inlineStart: "1px",
    });

    const up = (await page.locator("#vertical > :first-child").boundingBox())!;
    const text = (await page.locator("#vertical > :last-child").boundingBox())!;
    expect(up.width).toBe(text.width);

    // With dir="rtl" and no lang, the first child rounds its right corners.
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
      "oklch(0.577 0.245 27.325)",
    );
    await expect(page.locator("#disabled")).toHaveCSS("opacity", "0.5");
    await expect(group).toHaveCSS("cursor", "auto");
  });
}

test("the optional input group script focuses the field from icons and text", async ({
  page,
}) => {
  await page.setContent(`
    <sensible-input-group>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
      <input aria-label="Search">
      <span>12 results</span>
      <button type="button" aria-label="Clear">x</button>
    </sensible-input-group>`);
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
