import { test, expect } from "@playwright/test";
import validateHtml from "../../../lib/validate-html";
import checkAccessibility from "../../../lib/check-accessibility";

const urlsToTest = [
  {
    url: "/",
    additionalHtmlvalidateRules: {},
    disableAccessibilityCheckRules: [],
  },
];

const devUrlsToTest = [];

test.describe("html validity and axe accessibility check", () => {
  urlsToTest.forEach((url) => {
    test(url.url, { tag: ["@a11y"] }, async ({ page }) => {
      await page.goto(url.url);
      await validateHtml(page, url.additionalHtmlvalidateRules || {});
      await checkAccessibility(page, url.disableAccessibilityCheckRules || []);
    });
  });

  devUrlsToTest.forEach((url) => {
    test(url.url, { tag: ["@wip", "@a11y"] }, async ({ page }) => {
      await page.goto(url.url);
      await validateHtml(page, url.additionalHtmlvalidateRules || {});
      await checkAccessibility(page, url.disableAccessibilityCheckRules || []);
    });
  });
});

test.describe("html validity and axe accessibility check without js or css", () => {
  // test.use({ javaScriptEnabled: false });

  urlsToTest.forEach((url) => {
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
      await checkAccessibility(page, url.disableAccessibilityCheckRules || []);
    });
  });

  devUrlsToTest.forEach((url) => {
    test(
      `${url.url}`,
      { tag: ["@wip", "@a11y"] },
      async ({ page, context }) => {
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
      },
    );
  });
});
