import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "./lib/set-cookie-preferences.ts";

acceptAllCookies();

test("blogs landing page", async ({ page }) => {
  await page.goto("/blogs/");
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
});

test("feeds listing page", async ({ page }) => {
  await page.goto("/blogs/feeds/");
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
});
