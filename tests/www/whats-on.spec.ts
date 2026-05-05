import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../lib/set-cookie-preferences.ts";
import validateHtml from "../lib/validate-html.ts";
import checkAccessibility from "../lib/check-accessibility.ts";

acceptAllCookies();

test(
  "event page",
  { tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"] },
  async ({ page }) => {
    const response = await page.goto("/whats-on/events/");
    await expect(response?.ok()).toBeTruthy();

    await page.locator("main").getByRole("link").first().click();
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.locator("h1")).toBeVisible();
    await validateHtml(page);
    await checkAccessibility(page);
  },
);

// test("exhibition page", {tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"]}, async ({ page }) => {
//   const response = await page.goto("/whats-on/exhibitions/");
//         await expect(response?.ok()).toBeTruthy();

//   await page.locator("main").getByRole("link").first().click();
//   await expect(page.locator("h1")).not.toBeEmpty();
//   await expect(page.locator("h1")).toBeVisible();
//   await validateHtml(page);
//   await checkAccessibility(page);
// });
