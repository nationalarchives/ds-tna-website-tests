import { test } from "@playwright/test";
import validateHtml from "../lib/validate-html";
import checkAccessibility from "../lib/check-accessibility";

test.describe("chromium only", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Test for Chromium only",
  );

  test("MI5 Official Secrets exhibition page", async ({ page }) => {
    await page.goto("/mi5-official-secrets/");
    await validateHtml(page);
    await checkAccessibility(page);
  });
});
