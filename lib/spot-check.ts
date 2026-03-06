import { test, expect } from "@playwright/test";
import validateHtml from "./validate-html";
import { SpotCheck } from "./types";
import checkAccessibility from "./check-accessibility";

const spotCheck: (urls: SpotCheck[], devUrls: SpotCheck[]) => void = async (
  urls,
  devUrls,
) => {
  test.describe("html validity and axe accessibility check", () => {
    urls.forEach((url) => {
      test(url.url, async ({ page }) => {
        await page.goto(url.url);
        await validateHtml(page, url.additionalHtmlvalidateRules || {});
        await checkAccessibility(
          page,
          url.disableAccessibilityCheckRules || [],
        );
      });
    });

    devUrls.forEach((url) => {
      test(url.url, { tag: ["@wip"] }, async ({ page }) => {
        await page.goto(url.url);
        await validateHtml(page, url.additionalHtmlvalidateRules || {});
        await checkAccessibility(
          page,
          url.disableAccessibilityCheckRules || [],
        );
      });
    });
  });

  await test.describe("html validity and axe accessibility check without js or css", async () => {
    test.use({ javaScriptEnabled: false });

    urls.forEach((url) => {
      test(`${url.url}`, async ({ page, context }) => {
        await context.route("**", (route) => {
          return ["script", "stylesheet", "xhr"].includes(
            route.request().resourceType(),
          )
            ? route.abort()
            : route.continue();
        });
        const response = await page.goto(url.url);
        const status = await response?.status();
        expect(status).toEqual(200);
        await validateHtml(page, url.additionalHtmlvalidateRules || {});
        await checkAccessibility(
          page,
          url.disableAccessibilityCheckRules || [],
        );
      });
    });

    devUrls.forEach((url) => {
      test(`${url.url}`, { tag: ["@wip"] }, async ({ page, context }) => {
        await context.route("**", (route) => {
          return ["script", "stylesheet", "xhr"].includes(
            route.request().resourceType(),
          )
            ? route.abort()
            : route.continue();
        });
        const response = await page.goto(url.url);
        const status = await response?.status();
        expect(status).toEqual(200);
        await validateHtml(page, url.additionalHtmlvalidateRules || {});
        await checkAccessibility(
          page,
          url.disableAccessibilityCheckRules || [],
        );
      });
    });
  });
};

export default spotCheck;
