import { test, expect } from "@playwright/test";

// test("wagtail documentation landing page", async ({ page }) => {
//   await page.goto("/");
//   await expect(page.locator("h1")).not.toBeEmpty();
//   await expect(page.locator("h1")).toBeVisible();
// });

test("wagtail admin login", async ({ page }) => {
  await page.goto("/admin/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toContainText("Sign in to Wagtail");
});
