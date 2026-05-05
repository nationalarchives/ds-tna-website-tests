import { test, expect } from "@playwright/test";
import { setCookiePolicy } from "../../lib/set-cookie-preferences.ts";

test.describe(
  "accessibility tree",
  { tag: ["@site:www", "@service:ds-frontend", "@wip"] },
  () => {
    test("default state", async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/cookies/");
      await expect(page.locator("form")).toMatchAriaSnapshot({
        name: "preferences-default.aria.yml",
      });
    });

    test("accepted", async ({ page, context, baseURL }) => {
      await context.clearCookies();
      await setCookiePolicy(context, baseURL, true, true, true);
      await page.goto("/cookies/");
      await expect(page.locator("form")).toMatchAriaSnapshot({
        name: "preferences-accepted.aria.yml",
      });
    });

    test("declined", async ({ page, context, baseURL }) => {
      await context.clearCookies();
      await setCookiePolicy(context, baseURL, false, false, false);
      await page.goto("/cookies/");
      await expect(page.locator("form")).toMatchAriaSnapshot({
        name: "preferences-declined.aria.yml",
      });
    });
  },
);
