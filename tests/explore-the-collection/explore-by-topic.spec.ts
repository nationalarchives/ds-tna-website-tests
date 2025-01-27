import { test } from "@playwright/test";
import validateHtml from "../lib/validate-html";
import checkAccessibility from "../lib/check-accessibility";

test.describe("chromium only", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Test for Chromium only",
  );

  test("explore by topic", async ({ page }) => {
    await page.goto("/explore-the-collection/explore-by-topic/");
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("topic page", async ({ page }) => {
    await page.goto(
      "/explore-the-collection/explore-by-topic/arts-and-culture/",
    );
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("highlight gallery page", async ({ page }) => {
    await page.goto(
      "/explore-the-collection/second-world-war/second-world-war-propaganda-posters/",
    );
    await validateHtml(page);
    await checkAccessibility(page);
  });
});
