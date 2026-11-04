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
    // Other Escape listeners still run, and see the event as handled.
    await page.evaluate(() => {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          Object.assign(window, { handledEscape: event.defaultPrevented });
        }
      });
    });
    await page.keyboard.press("Escape");
    await expect(tip).toBeHidden();
    await expect(save).toBeFocused();
    expect(await page.evaluate(() => (window as unknown as { handledEscape?: boolean }).handledEscape)).toBe(true);

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

const row = `<section class="sensible-ui" style="display: flex; gap: 48px; padding: 80px">
  ${["Alpha", "Beta", "Gamma"]
    .map(
      (name) =>
        `<sensible-tooltip><button id="${name}">${name}</button><span role="tooltip">${name} tip</span></sensible-tooltip>`,
    )
    .join("")}
</section>`;

for (const path of ["interest invokers", "fallback listeners"]) {
  test(`with ${path}, a visible tooltip lets neighbors skip the show delay until people stop reading`, async ({
    page,
  }) => {
    await page.setContent(row);
    await page.addStyleTag({
      content: await readFile("dist/sensible-ui.css", "utf8"),
    });
    if (path === "fallback listeners") {
      await page.evaluate(() => {
        delete (HTMLButtonElement.prototype as { interestForElement?: unknown })
          .interestForElement;
      });
    }
    await page.addScriptTag({
      content: await readFile("dist/sensible-tooltip.js", "utf8"),
      type: "module",
    });
    await page.waitForFunction(() => customElements.get("sensible-tooltip"));
    const interestFor = await page.locator("#Alpha").getAttribute("interestfor");
    expect(interestFor !== null).toBe(path === "interest invokers");

    // Record when the pointer enters each trigger and when its tooltip opens.
    await page.evaluate(() => {
      const log: Record<string, { entered?: number; opened?: number }> = {};
      Object.assign(window, { tooltipLog: log });
      for (const tooltip of Array.from(document.querySelectorAll("sensible-tooltip"))) {
        const trigger = tooltip.firstElementChild!;
        trigger.addEventListener("pointerenter", () => {
          log[trigger.id] = { entered: performance.now() };
        });
        tooltip.querySelector("[role=tooltip]")!.addEventListener("toggle", (event) => {
          if ((event as ToggleEvent).newState === "open") {
            log[trigger.id].opened = performance.now();
          }
        });
      }
    });
    const center = async (id: string) => {
      const box = (await page.locator(`#${id}`).boundingBox())!;
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    };
    const tip = (id: string) => page.getByRole("tooltip", { name: `${id} tip` });
    // toggle fires in a later task than :popover-open, so wait for the log.
    const delay = async (id: string) => {
      const handle = await page.waitForFunction((id) => {
        const entry = (window as unknown as { tooltipLog: Record<string, { entered?: number; opened?: number }> }).tooltipLog[id];
        // Wrap the delay: an instant switch measures 0ms, which is falsy and
        // would keep waitForFunction polling.
        return entry?.opened !== undefined && entry.entered !== undefined
          ? { delay: entry.opened - entry.entered }
          : false;
      }, id);
      await expect(tip(id)).toBeVisible();
      return ((await handle.jsonValue()) as { delay: number }).delay;
    };
    const moveTo = async (id: string) => {
      const point = await center(id);
      await page.mouse.move(point.x, point.y, { steps: 4 });
    };

    // The first tooltip waits for the show delay.
    await page.mouse.move(0, 0);
    await moveTo("Alpha");
    expect(await delay("Alpha")).toBeGreaterThanOrEqual(400);

    // Moving to a neighbor while one shows switches immediately.
    await moveTo("Beta");
    expect(await delay("Beta")).toBeLessThan(150);
    await expect(tip("Alpha")).toBeHidden();

    // After the tooltip closes, a short grace period still skips the delay.
    const beta = await center("Beta");
    await page.mouse.move(beta.x, beta.y + 60);
    await page.waitForFunction(
      () => !document.querySelector("#Beta + [role=tooltip]")!.matches(":popover-open"),
      undefined,
      { polling: "raf" },
    );
    await moveTo("Gamma");
    expect(await delay("Gamma")).toBeLessThan(150);

    // After people stop reading tooltips, the delay returns.
    await page.mouse.move(0, 0);
    await expect(tip("Gamma")).toBeHidden();
    await page.waitForTimeout(800);
    await moveTo("Alpha");
    expect(await delay("Alpha")).toBeGreaterThanOrEqual(400);

    // Escape ends the reading session immediately.
    await moveTo("Beta");
    expect(await delay("Beta")).toBeLessThan(150);
    await page.keyboard.press("Escape");
    await expect(tip("Beta")).toBeHidden();
    await moveTo("Gamma");
    expect(await delay("Gamma")).toBeGreaterThanOrEqual(400);
  });
}

test("tooltips keep fields full width, avoid covering their control, and show one at a time", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.setContent(`<main class="sensible-ui" style="padding: 16px">
    <p><sensible-tooltip side="right">
      <button id="share">Share</button>
      <span role="tooltip" id="share-tip">Members can view and comment on this document, but only owners can change sharing settings or delete it.</span>
    </sensible-tooltip></p>
    <div>
      <label for="email">Billing email</label>
      <sensible-tooltip><input id="email"><span role="tooltip" id="email-tip">Used for invoices</span></sensible-tooltip>
    </div>
    <div id="scroller" style="height: 80px; overflow: auto">
      <sensible-tooltip><input id="row" aria-label="Row note"><span role="tooltip" id="row-tip">Saved with the row</span></sensible-tooltip>
      <div style="height: 400px"></div>
    </div>
  </main>`);
  await page.addStyleTag({ content: await readFile("dist/sensible-ui.css", "utf8") });
  await page.addScriptTag({
    content: await readFile("dist/sensible-tooltip.js", "utf8"),
    type: "module",
  });
  await page.waitForFunction(() => customElements.get("sensible-tooltip"));

  expect((await page.locator("#email").boundingBox())!.width).toBe(288);
  await expect(page.locator('label[for="email"]')).toHaveCSS("padding-bottom", "8px");

  // A side tooltip with no room beside its control moves above or below it.
  await page.locator("#share-tip").evaluate((tip: HTMLElement) => tip.showPopover());
  const tip = (await page.locator("#share-tip").boundingBox())!;
  const share = (await page.locator("#share").boundingBox())!;
  expect(tip.y + tip.height <= share.y || tip.y >= share.y + share.height).toBe(true);
  await page.locator("#share-tip").evaluate((tip: HTMLElement) => tip.hidePopover());

  // A keyboard-focused field's tooltip closes when another tooltip opens.
  await page.locator("#share").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#email-tip")).toBeVisible();
  await page.locator("#share").hover();
  await expect(page.locator("#share-tip")).toBeVisible();
  await expect(page.locator("#email-tip")).toBeHidden();

  // Scrolling closes a fallback tooltip instead of leaving it floating.
  // Fields use the fallback even where buttons use interest invokers.
  await page.mouse.move(0, 0);
  await page.locator("#row").focus();
  await expect(page.locator("#row-tip")).toBeVisible();
  await page.locator("#scroller").evaluate((node) => node.scrollTo(0, 200));
  await expect(page.locator("#row-tip")).toBeHidden();
});

test("the script places a tooltip that CSS left away from its control", async ({
  page,
}) => {
  // Firefox misplaces anchored tooltips inside a right-to-left part of a
  // left-to-right page. A margin stands in for that bug in Chromium.
  await page.setContent(`<main class="sensible-ui" style="padding: 80px">
    <style>#lost-tip { margin-inline-start: -2000px; }</style>
    <sensible-tooltip><input id="lost" aria-label="Lost"><span role="tooltip" id="lost-tip">Lost tip</span></sensible-tooltip>
    <sensible-tooltip><input id="found" aria-label="Found"><span role="tooltip" id="found-tip">Found tip</span></sensible-tooltip>
  </main>`);
  await page.addStyleTag({ content: await readFile("dist/sensible-ui.css", "utf8") });
  await page.addScriptTag({
    content: await readFile("dist/sensible-tooltip.js", "utf8"),
    type: "module",
  });
  await page.waitForFunction(() => customElements.get("sensible-tooltip"));

  for (const id of ["lost", "found"]) {
    await page.keyboard.press("Tab");
    await expect(page.locator(`#${id}`)).toBeFocused();
    await expect(page.locator(`#${id}-tip`)).toBeVisible();
    const tip = (await page.locator(`#${id}-tip`).boundingBox())!;
    const field = (await page.locator(`#${id}`).boundingBox())!;
    expect(tip.x).toBeGreaterThanOrEqual(0);
    expect(tip.x).toBeLessThan(field.x + field.width);
    expect(tip.x + tip.width).toBeGreaterThan(field.x);
    expect(tip.y + tip.height).toBeLessThanOrEqual(field.y);
    expect(tip.y + tip.height).toBeGreaterThan(field.y - 12);
  }
  // A tooltip that CSS placed correctly keeps CSS positioning.
  await expect(page.locator("#found-tip")).not.toHaveAttribute("style");
});
