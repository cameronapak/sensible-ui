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
