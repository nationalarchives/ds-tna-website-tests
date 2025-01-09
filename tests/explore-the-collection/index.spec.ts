import { test, expect } from "@playwright/test";

test("explore the collection home page", async ({ page }) => {
  await page.goto("/explore-the-collection/");

  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
});
