import { test, expect, Cookie, Page } from "@playwright/test";

const oldPagePath = "/";
const newPagePath = "/explore-the-collection/";
const newCookieBannerSelector = ".tna-cookie-banner";
const oldCookieBannerSelector = "#ds-cookie-consent-banner";
const cookiePreferencesSetKey = "dontShowCookieNotice";

const getCookieDomainFromBaseUrl: (baseURL: string | undefined) => string = (
  baseURL = "https://www.nationalarchives.gov.uk",
) => {
  return `.${baseURL.replace(/^https?:\/\/(www.)?/, "")}`;
};

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.afterEach(async ({ context }) => {
  const cookies = await context.cookies();
  const cookiesPolicy: Cookie | undefined = cookies.find(
    (cookie) => cookie.name === "cookies_policy",
  );
  expect(cookiesPolicy).toBeDefined();
  if (cookiesPolicy) {
    const cookiesPolicyValue = JSON.parse(
      decodeURIComponent(cookiesPolicy.value),
    );
    expect(cookiesPolicyValue).toHaveProperty("essential");
    expect(cookiesPolicyValue).toHaveProperty("settings");
    expect(cookiesPolicyValue).toHaveProperty("usage");
    // expect(cookiesPolicyValue).toHaveProperty("marketing");
    expect(cookiesPolicyValue?.essential).toBeDefined();
    expect(cookiesPolicyValue?.settings).toBeDefined();
    expect(cookiesPolicyValue?.usage).toBeDefined();
    // expect(cookiesPolicyValue?.marketing).toBeDefined();
  }
});

test.describe("cookie banners", () => {
  test.describe("no existing cookies", () => {
    test("don't interact on new page then visit old page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
    });

    test("accept on new page then visit old page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      await page.locator('button:text("Accept cookies")').click();
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).not.toBeVisible();
    });

    test("reject on new page then visit old page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      await page.locator('button:text("Reject cookies")').click();
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).not.toBeVisible();
    });

    test("don't interact on new page, don't interact on old page then return to new page", async ({
      page,
    }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
    });

    test("visit new page, accept on old page then return to new page", async ({
      page,
    }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
      await page.locator('button:text("Accept cookies")').click();
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).not.toBeVisible();
    });

    test("visit new page, reject on old page then return to new page", async ({
      page,
    }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
      await page.locator('button:text("Reject cookies")').click();
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).not.toBeVisible();
    });

    test.describe("with cookie preferences set", () => {
      test.beforeEach(async ({ context, baseURL }) => {
        await context.addCookies([
          {
            name: cookiePreferencesSetKey,
            value: "true",
            domain: getCookieDomainFromBaseUrl(baseURL),
            path: "/",
          },
        ]);
      });

      test.fixme("visit new page", async ({ page }) => {
        await page.goto(newPagePath);
        await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      });

      test.fixme("visit old page", async ({ page }) => {
        await page.goto(oldPagePath);
        await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
      });
    });
  });

  test.describe("partial existing cookies", () => {
    test("visit new page", async ({ page, context, baseURL }) => {
      await context.addCookies([
        {
          name: "cookies_policy",
          value: "%7B%22usage%22%3Atrue%7D",
          domain: getCookieDomainFromBaseUrl(baseURL),
          path: "/",
        },
      ]);
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
    });

    test("visit old page", async ({ page, context, baseURL }) => {
      await context.addCookies([
        {
          name: "cookies_policy",
          value: "%7B%22usage%22%3Atrue%7D",
          domain: getCookieDomainFromBaseUrl(baseURL),
          path: "/",
        },
      ]);
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
    });

    test.describe("with cookie preferences set", () => {
      test.beforeEach(async ({ context, baseURL }) => {
        await context.addCookies([
          {
            name: cookiePreferencesSetKey,
            value: "true",
            domain: getCookieDomainFromBaseUrl(baseURL),
            path: "/",
          },
        ]);
      });

      test.fixme("visit new page", async ({ page }) => {
        await page.goto(newPagePath);
        await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      });

      test.fixme("visit old page", async ({ page }) => {
        await page.goto(oldPagePath);
        await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
      });
    });
  });

  test.describe("malformed cookies", () => {
    test.beforeEach(async ({ context, baseURL }) => {
      await context.addCookies([
        {
          name: "cookies_policy",
          value: "foobar",
          domain: getCookieDomainFromBaseUrl(baseURL),
          path: "/",
        },
      ]);
    });

    test("visit new page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(page.locator(newCookieBannerSelector)).toBeVisible();
    });

    test("visit old page", async ({ page }) => {
      await page.goto(oldPagePath);
      await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
    });

    test.describe("with cookie preferences set", () => {
      test.beforeEach(async ({ context, baseURL }) => {
        await context.addCookies([
          {
            name: cookiePreferencesSetKey,
            value: "true",
            domain: getCookieDomainFromBaseUrl(baseURL),
            path: "/",
          },
        ]);
      });

      test.fixme("visit new page", async ({ page }) => {
        await page.goto(newPagePath);
        await expect(page.locator(newCookieBannerSelector)).toBeVisible();
      });

      test.fixme("visit old page", async ({ page }) => {
        await page.goto(oldPagePath);
        await expect(page.locator(oldCookieBannerSelector)).toBeVisible();
      });
    });
  });
});
