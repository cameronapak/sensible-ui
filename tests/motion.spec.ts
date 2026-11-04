import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: press feedback respects disabled and reduced-motion states`, async ({
    page,
  }) => {
    await page.setContent(`<section class="sensible-ui">
      <button>Save</button><button disabled>Unavailable</button>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });
    const button = page.getByRole("button", { name: "Save", exact: true });
    const bounds = (await button.boundingBox())!;
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await page.mouse.down();
    await expect(button).toHaveCSS("scale", "0.97");
    expect((await button.boundingBox())!.width).toBeCloseTo(
      bounds.width * 0.97,
      1,
    );
    await page.mouse.up();
    await expect(button).toHaveCSS("scale", "none");

    const disabled = page.getByRole("button", { name: "Unavailable" });
    await disabled.hover();
    await page.mouse.down();
    await expect(disabled).toHaveCSS("scale", "none");
    await page.mouse.up();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await button.hover();
    await page.mouse.down();
    await expect(button).toHaveCSS("scale", "none");
    await page.mouse.up();
  });

  test(`${bundle}: progress fills to its value and indeterminate motion stops for reduced motion`, async ({
    page,
  }) => {
    await page.setContent(`<section class="sensible-ui" style="width: 200px">
      <progress id="known" max="200" value="50"></progress>
      <progress id="unknown"></progress>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    const known = page.locator("#known");
    expect(await known.boundingBox()).toMatchObject({ width: 200, height: 8 });
    // Sample the rendered bar on both sides of the 25% value boundary.
    const [filled, track] = await page.evaluate(async (png) => {
      const image = new Image();
      image.src = `data:image/png;base64,${png}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const y = Math.floor(image.height / 2);
      return [0.2, 0.3].map(
        (at) => context.getImageData(Math.floor(image.width * at), y, 1, 1).data[0],
      );
    }, (await known.screenshot()).toString("base64"));
    expect(filled).toBeLessThan(40);
    expect(track).toBeGreaterThan(180);

    const animation = (selector: string) =>
      page.locator(selector).evaluate((node) => {
        const style = getComputedStyle(node);
        return [style.animationName, style.animationDirection];
      });
    expect(await animation("#unknown")).toEqual([
      "sensible-progress-indeterminate",
      "alternate",
    ]);

    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await animation("#unknown")).toEqual(["none", "normal"]);
    expect(
      await page
        .locator("#unknown")
        .evaluate((node) => getComputedStyle(node).backgroundImage),
    ).toContain("repeating-linear-gradient");
  });

  test(`${bundle}: switches move toward inline-end and remain usable without motion`, async ({
    page,
  }) => {
    await page.setContent(`<section class="sensible-ui">
      <label>LTR<input type="checkbox" role="switch"></label>
      <label dir="rtl">RTL<input type="checkbox" role="switch"></label>
    </section>`);
    await page.addStyleTag({ content: await readFile(bundle, "utf8") });

    for (const direction of ["LTR", "RTL"]) {
      const toggle = page.getByRole("switch", { name: direction });
      await toggle.focus();
      await page.keyboard.press("Space");
      await expect(toggle).toBeChecked();
      await expect
        .poll(() =>
          toggle.evaluate((node) => {
            const thumb = getComputedStyle(node, "::before");
            return [thumb.marginLeft, thumb.marginRight];
          }),
        )
        .toEqual(direction === "LTR" ? ["14px", "0px"] : ["0px", "14px"]);
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const direction of ["LTR", "RTL"]) {
      const toggle = page.getByRole("switch", { name: direction });
      await toggle.uncheck();
      await expect(toggle).not.toBeChecked();
      expect(
        await toggle.evaluate((node) => ({
          margin: getComputedStyle(node, "::before").marginInlineStart,
          duration: getComputedStyle(node, "::before").transitionDuration,
        })),
      ).toEqual({ margin: "0px", duration: "0s" });
    }
  });
}
