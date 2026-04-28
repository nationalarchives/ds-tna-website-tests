import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../lib/set-cookie-preferences.ts";

acceptAllCookies();

test("blogs landing page", { tag: ["@www"] }, async ({ page }) => {
  const response = await page.goto("/blogs/");
  await expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
});

test("feeds listing page", { tag: ["@www"] }, async ({ page }) => {
  const response = await page.goto("/blogs/feeds/");
  await expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
});
