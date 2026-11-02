import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const word = "Supercalifragilisticexpialidocious".repeat(3);

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: unbreakable content stays inside a narrow container`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.setContent(`<main class="sensible-ui" style="width: 288px">
      <ul><li>${word}</li></ul>
      <blockquote>${word}</blockquote>
      <dl><dt>${word}</dt><dd>${word}</dd></dl>
      <p><a href="#">${word}</a></p>
      <figure><figcaption>${word}</figcaption></figure>
      <div><input type="checkbox" id="check"><label for="check">${word}</label></div>
      <fieldset><legend>${word}</legend><label><input type="radio"> ${word}</label></fieldset>
      <a class="item" href="#"><svg width="16" height="16"></svg><div><h3>${word}</h3><p>${word}</p></div></a>
      <details><summary>${word}</summary></details>
      <div class="x-stack"><p>${word}</p><button>Go</button></div>
      <div class="split"><h3>${word}</h3><button>Go</button></div>
      <span class="badge">${word}</span>
    </main>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    const overflowing = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const edge = main.getBoundingClientRect().right;
      return Array.from(main.querySelectorAll("*"))
        .filter((node) => node.getBoundingClientRect().right > edge + 0.5)
        .map((node) => node.tagName.toLowerCase());
    });
    expect(overflowing).toEqual([]);
  });

  test(`${bundle}: hover feedback needs a hover-capable pointer`, async ({
    browser,
  }) => {
    const css = await readFile(bundle, "utf8");
    const colors = async (touch: boolean) => {
      // Reduced motion removes color transitions so computed colors are final.
      const context = await browser.newContext({
        hasTouch: touch,
        isMobile: touch,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.setContent(`<section class="sensible-ui">
        <button data-variant="outline">Hover</button>
        <button data-variant="outline" aria-pressed="true">Pressed</button>
        <button data-variant="outline">Resting</button>
      </section>`);
      await page.addStyleTag({ content: css });
      await page.getByRole("button", { name: "Hover" }).hover();
      const result = await page.$$eval("button", (buttons) =>
        buttons.map((node) => getComputedStyle(node).backgroundColor),
      );
      await context.close();
      return result;
    };

    const [mouseHover, mousePressed, mouseResting] = await colors(false);
    expect(mousePressed).not.toBe(mouseResting);
    expect(mouseHover).toBe(mousePressed);

    const [touchHover, touchPressed, touchResting] = await colors(true);
    expect(touchHover).toBe(touchResting);
    expect(touchPressed).toBe(mousePressed);
  });

  test(`${bundle}: narrow screens get 16px form text and short buttons keep a minimum width`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.setContent(`<section class="sensible-ui">
      <select><option>One</option></select>
      <button>OK</button>
      <button data-size="icon" aria-label="Add">+</button>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });
    await expect(page.locator("select")).toHaveCSS("font-size", "16px");
    expect(
      (await page.getByRole("button", { name: "OK" }).boundingBox())!.width,
    ).toBe(64);
    expect(
      await page.getByRole("button", { name: "Add" }).boundingBox(),
    ).toMatchObject({
      width: 36,
      height: 36,
    });

    await page.setViewportSize({ width: 1024, height: 800 });
    await expect(page.locator("select")).toHaveCSS("font-size", "14px");
  });
}

test("unbundled input source keeps vendor pseudo-element rules", async ({
  page,
}) => {
  // Standalone exports ship src/css directly, so the browser parses it without bundler rewrites.
  await page.setContent(`<input type="color"><input type="range">`);
  await page.addStyleTag({
    content: await readFile("src/css/input.css", "utf8"),
  });
  const selectors = await page.evaluate(() => {
    const found: string[] = [];
    const walk = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) found.push(rule.selectorText);
        if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
      }
    };
    for (const sheet of Array.from(document.styleSheets)) walk(sheet.cssRules);
    return found.join("\n");
  });
  expect(selectors).toContain("::-webkit-color-swatch");
  expect(selectors).toContain("::-webkit-slider-thumb");
});
