import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../lib/set-cookie-preferences.ts";

acceptAllCookies();

test("page permalink", async ({ page }) => {
  const response = await page.goto("/page/5/");
  await expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
  await expect(page).toHaveURL(/\/explore-the-collection\//);
});

test("page preview for unprotected page", async ({ page }) => {
  const response = await page.goto("/preview/5/");
  await expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
  await expect(page).toHaveURL(/\/explore-the-collection\//);
});
