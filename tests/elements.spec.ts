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
