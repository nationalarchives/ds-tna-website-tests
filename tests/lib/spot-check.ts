import { test, expect } from "@playwright/test";
import validateHtml from "./validate-html";
import { SpotCheck } from "./types";
import checkAccessibility from "./check-accessibility";

const spotCheck: (
  urls: SpotCheck[],
  devUrls: SpotCheck[],
  tag: string[],
) => void = async (urls, devUrls, tag = []) => {
  test.describe("html validity and axe accessibility check", { tag }, () => {
    urls.forEach((url) => {
      test(url.url, async ({ page }) => {
        const response = await page.goto(url.url);
        await expect(response?.ok()).toBeTruthy();
        await validateHtml(page, url.additionalHtmlvalidateRules || {});
        await checkAccessibility(
          page,
          url.disableAccessibilityCheckRules || [],
        );
      });
    });

    devUrls.forEach((url) => {
      test(url.url, { tag: ["@wip"] }, async ({ page }) => {
        const response = await page.goto(url.url);
        await expect(response?.ok()).toBeTruthy();
        await validateHtml(page, url.additionalHtmlvalidateRules || {});
        await checkAccessibility(
          page,
          url.disableAccessibilityCheckRules || [],
        );
      });
    });
  });

  await test.describe(
    "html validity and axe accessibility check without js or css",
    { tag },
    async () => {
      // test.use({ javaScriptEnabled: false });

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
          await expect(response?.ok()).toBeTruthy();
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
          await expect(response?.ok()).toBeTruthy();
          await validateHtml(page, url.additionalHtmlvalidateRules || {});
          await checkAccessibility(
            page,
            url.disableAccessibilityCheckRules || [],
          );
        });
      });
    },
  );
};

export default spotCheck;
