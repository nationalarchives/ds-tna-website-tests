import { test, expect } from "@playwright/test";
import acceptAllCookies from "./lib/accept-all-cookies.ts";

acceptAllCookies();

test("blogs landing page", async ({ page }) => {
  await page.goto("/blogs/");
  await expect(page.locator("h1")).toHaveText(/Blogs at The National Archives/);
});

test("feeds listing page", async ({ page }) => {
  await page.goto("/blogs/feeds/");
  await expect(page.locator("h1")).toHaveText(/Blog feeds/);
});
