import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const markup = `<section class="sensible-ui" style="padding: 80px">
  <button id="before">Before</button>
  <sensible-tooltip>
    <button id="save">Save</button><span role="tooltip">Save the draft</span>
  </sensible-tooltip>
  <sensible-tooltip side="bottom">
    <button id="bold" aria-labelledby="bold-tip">B</button><span role="tooltip" id="bold-tip">Bold</span>
  </sensible-tooltip>
  <dialog><sensible-tooltip>
    <button id="inner">Inner</button><span role="tooltip">Inside a dialog</span>
  </sensible-tooltip></dialog>
</section>`;

async function setup(page: Page, bundle: string, script: boolean) {
  await page.setContent(markup);
  await page.addStyleTag({ content: await readFile(bundle, "utf8") });
  if (script) {
    await page.addScriptTag({
      content: await readFile("dist/sensible-tooltip.js", "utf8"),
      type: "module",
    });
    await page.waitForFunction(() => customElements.get("sensible-tooltip"));
  }
}

for (const bundle of ["dist/sensible-ui.css", "dist/scoped/sensible-ui.css"]) {
  test(`${bundle}: without the script, tooltip text is hidden but stays next to its control`, async ({
    page,
  }) => {
    await setup(page, bundle, false);
    const tip = page.getByText("Save the draft");
    expect(await tip.boundingBox()).toMatchObject({ width: 1, height: 1 });
    await expect(page.getByRole("tooltip").first()).toHaveText("Save the draft");
    await expect(page.locator("#save")).not.toHaveAttribute("aria-describedby");
  });
}

for (const path of ["interest invokers", "fallback listeners"]) {
  test(`with ${path}, tooltips describe, show, place, and dismiss`, async ({
    page,
  }) => {
    await setup(page, "dist/sensible-ui.css", path === "interest invokers");
    if (path === "fallback listeners") {
      // Simulate a browser without interest invokers, such as Safari.
      await page.evaluate(() => {
        delete (HTMLButtonElement.prototype as { interestForElement?: unknown })
          .interestForElement;
      });
      await page.addScriptTag({
        content: await readFile("dist/sensible-tooltip.js", "utf8"),
        type: "module",
      });
      await page.waitForFunction(() => customElements.get("sensible-tooltip"));
    }
    const save = page.locator("#save");
    const tip = page.getByRole("tooltip", { name: "Save the draft" });

    await expect(save).toHaveAccessibleDescription("Save the draft");
    await expect(page.locator("#bold")).toHaveAccessibleName("Bold");
    await expect(page.locator("#bold")).not.toHaveAttribute("aria-describedby");
    if (path === "interest invokers") {
      await expect(save).toHaveAttribute("interestfor", /.+/);
    } else {
      await expect(save).not.toHaveAttribute("interestfor");
    }

    await save.hover();
    await page.waitForTimeout(100);
    await expect(tip).toBeHidden();
    await expect(tip).toBeVisible();
    const tipBox = (await tip.boundingBox())!;
    const saveBox = (await save.boundingBox())!;
    expect(tipBox.y + tipBox.height).toBeLessThanOrEqual(saveBox.y);

    // The pointer can move onto the tooltip without closing it.
    await page.mouse.move(tipBox.x + tipBox.width / 2, tipBox.y + 4, { steps: 3 });
    await page.waitForTimeout(700);
    await expect(tip).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(tip).toBeHidden();

    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(tip).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(tip).toBeHidden();
    await expect(save).toBeFocused();

    // Only one tooltip shows at a time; bottom tooltips sit below.
    await page.keyboard.press("Tab");
    const bold = page.getByRole("tooltip", { name: "Bold" });
    await expect(bold).toBeVisible();
    await expect(tip).toBeHidden();
    const boldBox = (await bold.boundingBox())!;
    const boldTrigger = (await page.locator("#bold").boundingBox())!;
    expect(boldBox.y).toBeGreaterThanOrEqual(boldTrigger.y + boldTrigger.height);
    await page.keyboard.press("Escape");

    // Escape closes a tooltip before the dialog around it.
    await page.locator("dialog").evaluate((dialog: HTMLDialogElement) => dialog.showModal());
    await page.locator("#inner").focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(page.locator("#inner")).toBeFocused();
    await expect(page.getByRole("tooltip", { name: "Inside a dialog" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip", { name: "Inside a dialog" })).toBeHidden();
    await expect(page.locator("dialog")).toHaveJSProperty("open", true);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveJSProperty("open", false);
  });
}

test("tooltips wire late children and close when removed", async ({ page }) => {
  await setup(page, "dist/sensible-ui.css", true);
  const result = await page.evaluate(async () => {
    const element = document.createElement("sensible-tooltip");
    document.body.append(element);
    element.innerHTML = '<button id="late">Late</button><span role="tooltip">Late tip</span>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    const tip = element.querySelector<HTMLElement>("[role=tooltip]")!;
    tip.showPopover();
    element.remove();
    return {
      describedBy: element.querySelector("#late")!.getAttribute("aria-describedby"),
      tipId: tip.id,
      open: tip.matches(":popover-open"),
    };
  });
  expect(result.describedBy).toBe(result.tipId);
  expect(result.open).toBe(false);
});

test("reduced motion shows tooltips without scaling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await setup(page, "dist/sensible-ui.css", true);
  await page.locator("#before").focus();
  await page.keyboard.press("Tab");
  const tip = page.getByRole("tooltip", { name: "Save the draft" });
  await expect(tip).toBeVisible();
  await expect(tip).toHaveCSS("transition-duration", /^0s/);
  await expect(tip).toHaveCSS("scale", "none");
});
