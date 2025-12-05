import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "./lib/set-cookie-preferences.ts";
import validateHtml from "./lib/validate-html";
import checkAccessibility from "./lib/check-accessibility";

acceptAllCookies();

test("what's on landing page", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/whats-on/");
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
});

test("what's on events page", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/whats-on/events/");
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
  await validateHtml(page);
  await checkAccessibility(page);

  await page.locator("main").getByRole("link").first().click();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
  await validateHtml(page);
  await checkAccessibility(page);
});

test("what's on exhibitions page", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/whats-on/exhibitions/");
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
  await validateHtml(page);
  await checkAccessibility(page);

  await page.locator("main").getByRole("link").first().click();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.locator("h1")).toBeVisible();
  await validateHtml(page);
  await checkAccessibility(page);
});
