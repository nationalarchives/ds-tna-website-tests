import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../../lib/set-cookie-preferences.ts";

acceptAllCookies();

test("page permalink", async ({ page }) => {
  await page.goto("/page/5/");
  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
  await expect(page).toHaveURL(/\/explore-the-collection\//);
});

test("page preview for unprotected page", async ({ page }) => {
  await page.goto("/preview/5/");
  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
  await expect(page).toHaveURL(/\/explore-the-collection\//);
});
