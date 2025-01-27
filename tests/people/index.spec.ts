import { test } from "@playwright/test";
import validateHtml from "../lib/validate-html";
import checkAccessibility from "../lib/check-accessibility";

test.describe("chromium only", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Test for Chromium only",
  );

  test("people index page", async ({ page }) => {
    await page.goto("/people/");
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("person profile page", async ({ page }) => {
    await page.goto("/people/vicky-iglikowski-broad/");
    await validateHtml(page);
    await checkAccessibility(page);
  });
});
