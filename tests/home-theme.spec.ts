import { expect, test } from "@playwright/test";

test("toggles the gallery between light and dark themes", async ({ page }) => {
  await page.goto("/");

  const toggle = page.locator("[data-theme-toggle]");
  await expect(toggle).toHaveText("Dark mode");
  const background = () =>
    page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).backgroundColor);
  const lightBackground = await background();

  await toggle.click();
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(toggle).toHaveText("Light mode");
  expect(await background()).not.toBe(lightBackground);

  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass("dark");
  await expect(toggle).toHaveText("Dark mode");
  expect(await background()).toBe(lightBackground);
});
