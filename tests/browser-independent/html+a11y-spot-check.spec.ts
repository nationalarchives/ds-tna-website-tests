import { test } from "@playwright/test";
import validateHtml from "../lib/validate-html";
import checkAccessibility from "../lib/check-accessibility";

const urlsToTest = [
  "/explore-the-collection/",
  "/explore-the-collection/stories/",
  "/explore-the-collection/stories/?page=2",
  "/explore-the-collection/stories/robert-wedderburn/",
  "/explore-the-collection/stories/the-bethnal-green-tube-shelter-disaster/",
  "/explore-the-collection/stories/sir-henry-coles-rat/",
  "/explore-the-collection/explore-by-topic/",
  "/explore-the-collection/explore-by-topic/arts-and-culture/",
  "/explore-the-collection/second-world-war/second-world-war-propaganda-posters/",
  "/people/",
  "/people/vicky-iglikowski-broad/",
  "/people/vicky-iglikowski-broad/?page=1",
  "/mi5-official-secrets/",
];

const devUrlsToTest = [
  "/blog/",
  "/blog/feeds/",
  "/about-us/",
  "/about-us/our-role/",
  "/about-us/our-role/annual-report-and-accounts-202324/",
  "/about-us/our-role/our-plans/becoming-the-inclusive-archive/",
];

test.describe("html validity and axe accessibility check", () => {
  urlsToTest.forEach((url) => {
    test(url, async ({ page }) => {
      await page.goto(url);
      await validateHtml(page);
      await checkAccessibility(page);
    });
  });

  devUrlsToTest.forEach((url) => {
    test(url, { tag: "@dev" }, async ({ page }) => {
      await page.goto(url);
      await validateHtml(page);
      await checkAccessibility(page);
    });
  });
});

test.describe("html validity and axe accessibility check without js or css", () => {
  urlsToTest.forEach((url) => {
    test(`${url}`, async ({ page, context }) => {
      await context.route("**", (route) => {
        return ["script", "stylesheet", "xhr"].includes(
          route.request().resourceType(),
        )
          ? route.abort()
          : route.continue();
      });
      await page.goto(url);
      await validateHtml(page);
      await checkAccessibility(page);
    });
  });

  devUrlsToTest.forEach((url) => {
    test(`${url}`, { tag: "@dev" }, async ({ page, context }) => {
      await context.route("**", (route) => {
        return ["script", "stylesheet", "xhr"].includes(
          route.request().resourceType(),
        )
          ? route.abort()
          : route.continue();
      });
      await page.goto(url);
      await validateHtml(page);
      await checkAccessibility(page);
    });
  });
});
