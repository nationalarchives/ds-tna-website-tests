import { test } from "@playwright/test";
import validateHtml from "../../lib/validate-html";
import checkAccessibility from "../../lib/check-accessibility";

test.describe("chromium only", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Test for Chromium only",
  );

  test("explore the collection stories", async ({ page }) => {
    await page.goto("/explore-the-collection/stories/");
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("explore the collection stories, page 2", async ({ page }) => {
    await page.goto("/explore-the-collection/stories/?page=2");
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("article page", async ({ page }) => {
    await page.goto("/explore-the-collection/stories/robert-wedderburn/");
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("article page without js or css", async ({ context, page }) => {
    await page.route("**/*", (route) => {
      return ["script", "stylesheet"].includes(route.request().resourceType())
        ? route.abort()
        : route.continue();
    });
    await page.goto("/explore-the-collection/stories/robert-wedderburn/");
    await validateHtml(page);
    await checkAccessibility(page);
    // await page.screenshot({ path: "test.png",fullPage: true });
  });

  test("focused article page", async ({ page }) => {
    await page.goto(
      "/explore-the-collection/stories/the-bethnal-green-tube-shelter-disaster/",
    );
    await validateHtml(page);
    await checkAccessibility(page);
  });

  test("record revealed page", async ({ page }) => {
    await page.goto("/explore-the-collection/stories/sir-henry-coles-rat/");
    await validateHtml(page);
    await checkAccessibility(page);
  });
});
