import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("modal keeps focus, ignores backdrop clicks by default, and closes natively", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "View project" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Project details" });
  await expect(dialog).toBeVisible();
  await expect(
    page.locator('#project-dialog button[aria-label="Close"]'),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Done" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(trigger).not.toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.locator('#project-dialog button[aria-label="Close"]'),
  ).toBeFocused();
  await page.mouse.click(4, 4);
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator("#project-dialog")).toHaveJSProperty(
    "returnValue",
    "done",
  );
});

test("backdrop click dismisses only when explicitly enabled", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Show tip" }).click();
  const dialog = page.getByRole("dialog", { name: "A quick tip" });
  await expect(dialog).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
});

test("long modal scrolls its body, leaves actions visible, and uses dark tokens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 540 });
  await page.goto("/");
  await page.getByRole("button", { name: "Read project notes" }).click();
  const dialog = page.getByRole("dialog", { name: "Project notes" });
  const body = dialog.locator("section");
  const layout = await dialog.evaluate((element) => {
    const content = element.querySelector("section")!;
    const footer = element.querySelector("footer")!;
    return {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      scrollHeight: content.scrollHeight,
      clientHeight: content.clientHeight,
      footerBottom: footer.getBoundingClientRect().bottom,
      viewportHeight: innerHeight,
      background: getComputedStyle(element).backgroundColor,
    };
  });
  expect(layout.width).toBeLessThanOrEqual(390 - 32);
  expect(layout.height).toBeLessThanOrEqual(540 - 32);
  expect(layout.scrollHeight).toBeGreaterThan(layout.clientHeight);
  expect(layout.footerBottom).toBeLessThanOrEqual(layout.viewportHeight);
  await body.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(dialog.getByRole("button", { name: "Done" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator("[data-theme-toggle]").click();
  await page.getByRole("button", { name: "Read project notes" }).click();
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    ),
  ).not.toBe(layout.background);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(dialog).toHaveCSS("transition-duration", "0s");
  expect(
    await dialog.evaluate(
      (element) => getComputedStyle(element, "::backdrop").transitionDuration,
    ),
  ).toBe("0s");
});

test("non-modal dialog leaves the page interactive and requires its close control", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open note" }).click();
  const dialog = page.getByRole("dialog", { name: "Quick note" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    bottom: element.getBoundingClientRect().bottom,
    viewportHeight: innerHeight,
  }));
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await page.locator("[data-theme-toggle]").click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});

test("hostile copy and crowded actions remain readable and reachable in a short viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 300 });
  await page.goto("/");
  await page.evaluate(() => {
    document.body.innerHTML = `
      <dialog aria-labelledby="stress-title">
        <header>
          <h2 id="stress-title">Review all the changes requested by your team before continuing</h2>
          <p>https://example.com/projects/a-really-long-unbroken-address-without-any-spaces-or-breakpoints</p>
          <form method="dialog"><button aria-label="Close">×</button></form>
        </header>
        <section><p>verylongunbrokenvalueabcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz</p></section>
        <footer>
          <form method="dialog"><button data-variant="outline">Cancel and go back</button></form>
          <button type="button">Save a draft to continue later</button>
          <button type="button">Continue to project overview and review all pending approvals</button>
        </footer>
      </dialog>`;
    document.querySelector("dialog")!.showModal();
  });

  const dialog = page.getByRole("dialog", {
    name: "Review all the changes requested by your team before continuing",
  });
  const geometry = await dialog.evaluate((element) => {
    const content = element.querySelector("section")!;
    const title = element.querySelector("h2")!;
    return {
      dialogWidth: element.clientWidth,
      dialogScrollWidth: element.scrollWidth,
      dialogHeight: element.clientHeight,
      dialogScrollHeight: element.scrollHeight,
      contentWidth: content.clientWidth,
      contentScrollWidth: content.scrollWidth,
      contentHeight: content.clientHeight,
      contentScrollHeight: content.scrollHeight,
      contentOverflow: getComputedStyle(content).overflowY,
      titleWidth: title.clientWidth,
      titleScrollWidth: title.scrollWidth,
    };
  });
  expect(geometry.dialogScrollWidth).toBeLessThanOrEqual(geometry.dialogWidth);
  expect(geometry.contentScrollWidth).toBeLessThanOrEqual(
    geometry.contentWidth,
  );
  expect(geometry.titleScrollWidth).toBeLessThanOrEqual(geometry.titleWidth);
  expect(geometry.dialogScrollHeight).toBeGreaterThan(geometry.dialogHeight);
  expect(geometry.contentScrollHeight).toBeLessThanOrEqual(geometry.contentHeight);
  expect(geometry.contentOverflow).toBe("visible");

  await dialog.hover();
  await page.mouse.wheel(0, 600);
  await expect
    .poll(() => dialog.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  const lastAction = dialog.getByRole("button", {
    name: "Continue to project overview and review all pending approvals",
  });
  const actionText = await lastAction.evaluate((element) => ({
    whiteSpace: getComputedStyle(element).whiteSpace,
    height: element.clientHeight,
    scrollWidth: element.scrollWidth,
    width: element.clientWidth,
  }));
  expect(actionText.whiteSpace).toBe("normal");
  expect(actionText.height).toBeGreaterThan(36);
  expect(actionText.scrollWidth).toBeLessThanOrEqual(actionText.width);
  const buttonBottom = await lastAction.evaluate(
    (element) => element.getBoundingClientRect().bottom,
  );
  const dialogBottom = await dialog.evaluate(
    (element) => element.getBoundingClientRect().bottom,
  );
  expect(buttonBottom).toBeLessThan(dialogBottom);
  await lastAction.click();
  await expect(lastAction).toBeFocused();
});

test("closing keeps modal and non-modal layout stable until the exit ends", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.body.innerHTML = `<dialog id="closing">
      <header><h2>Confirm</h2></header>
      <section><p>Some details to read before choosing.</p></section>
      <footer><button type="button">Continue to the next stage after reviewing</button></footer>
    </dialog>`;
  });

  for (const mode of ["modal", "non-modal"] as const) {
    await page.evaluate((mode) => {
      const dialog = document.querySelector<HTMLDialogElement>("#closing")!;
      if (mode === "modal") dialog.showModal();
      else dialog.show();
    }, mode);

    const duringExit = await page.evaluate(() => {
      const dialog = document.querySelector<HTMLDialogElement>("#closing")!;
      const button = dialog.querySelector("footer button")!;
      dialog.close();
      const styles = getComputedStyle(dialog);
      return {
        open: dialog.open,
        display: styles.display,
        flexDirection: styles.flexDirection,
        position: styles.position,
        whiteSpace: getComputedStyle(button).whiteSpace,
      };
    });
    expect(duringExit, mode).toEqual({
      open: false,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      whiteSpace: "normal",
    });
    await expect(page.locator("#closing")).toBeHidden();
  }
});

test("scoped standalone dialog styles its descendants but not a sibling dialog", async ({
  page,
}) => {
  const css = await readFile("./dist/scoped/dialog.css", "utf8");
  await page.setContent(`
    <dialog id="outside"><header><h2>Outside</h2></header></dialog>
    <div class="sensible-ui">
      <dialog id="inside"><header><h2>Inside</h2><form method="dialog"><button>Close</button></form></header></dialog>
    </div>
  `);
  await page.addStyleTag({ content: css });
  const styles = await page.evaluate(() => {
    const outside = document.querySelector<HTMLDialogElement>("#outside")!;
    const inside = document.querySelector<HTMLDialogElement>("#inside")!;
    outside.show();
    inside.show();
    return {
      outsideDisplay: getComputedStyle(outside).display,
      insideDisplay: getComputedStyle(inside).display,
      insideButtonDisplay: getComputedStyle(inside.querySelector("button")!)
        .display,
      outsideRadius: getComputedStyle(outside).borderRadius,
      insideRadius: getComputedStyle(inside).borderRadius,
    };
  });
  expect(styles.outsideDisplay).toBe("block");
  expect(styles.insideDisplay).toBe("flex");
  expect(styles.insideButtonDisplay).toBe("inline-flex");
  expect(styles.insideRadius).not.toBe(styles.outsideRadius);
});
