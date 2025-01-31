import { test, expect, Cookie, Page } from "@playwright/test";

const newPagePath = "/explore-the-collection/";
const getCookieBanner = (page: Page) =>
  page.getByRole("region", { name: "Cookies on The National Archives" });
const oldPagePath = "/";
const oldCookieBanner = (page: Page) => getCookieBanner(page);
const cookiePreferencesSetKey = "dontShowCookieNotice";

const getCookieDomainFromBaseUrl: (baseURL: string | undefined) => string = (
  baseURL = "https://www.nationalarchives.gov.uk",
) => {
  const cookieDomains = {
    "https://www.nationalarchives.gov.uk": ".nationalarchives.gov.uk",
    "https://staging-www.nationalarchives.gov.uk": ".nationalarchives.gov.uk",
    "https://dev-www.nationalarchives.gov.uk": ".nationalarchives.gov.uk",
    "http://localhost:65535": "localhost:65535",
    // TODO: Remove dblclk.dev once moved fully to AWS
    "https://tna.dblclk.dev": ".dblclk.dev",
    "https://develop.tna.dblclk.dev": ".dblclk.dev",
  };

  if (cookieDomains.hasOwnProperty(baseURL)) {
    return cookieDomains[baseURL];
  }

  return `.${baseURL.replace(/^https?:\/\/(www.)?/, "")}`;
};

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.afterEach(async ({ context, baseURL }) => {
  const cookies = await context.cookies();
  const cookiesPolicy: Cookie | undefined = await cookies.find(
    (cookie) => cookie.name === "cookies_policy",
  );
  if (!(baseURL as string).includes("tna.dblclk.dev")) {
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
  }
});

test.describe("no existing cookies", { tag: "@ui" }, () => {
  test("don't interact on new page then visit old page", async ({ page }) => {
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).toBeVisible();
  });

  test("accept on new page then visit old page", async ({ page }) => {
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await page.getByRole("button", { name: "Accept cookies" }).click();
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).not.toBeVisible();
  });

  test("reject on new page then visit old page", async ({ page }) => {
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await page.getByRole("button", { name: "Reject cookies" }).click();
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).not.toBeVisible();
  });

  test("don't interact on new page, don't interact on old page then return to new page", async ({
    page,
  }) => {
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).toBeVisible();
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
  });

  test("visit new page, accept on old page then return to new page", async ({
    page,
    baseURL,
  }) => {
    test.skip(
      (baseURL as string).includes("tna.dblclk.dev"),
      "no old pages available on tna.dblclk.dev",
    );
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).toBeVisible();
    await page.getByRole("button", { name: "Accept cookies" }).click();
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
  });

  test("visit new page, reject on old page then return to new page", async ({
    page,
    baseURL,
  }) => {
    test.skip(
      (baseURL as string).includes("tna.dblclk.dev"),
      "no old pages available on tna.dblclk.dev",
    );
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).toBeVisible();
    await page.getByRole("button", { name: "Reject cookies" }).click();
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
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

    test("visit new page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(getCookieBanner(page)).toBeVisible();
    });

    test("visit old page", async ({ page, baseURL }) => {
      test.skip(
        (baseURL as string).includes("tna.dblclk.dev"),
        "no old pages available on tna.dblclk.dev",
      );
      await page.goto(oldPagePath);
      // This is incorrect behaviour - the ds-cookie-consent doesn't display if dontShowCookieNotice is set, regardless of whether cookies_policy is or not
      await expect(oldCookieBanner(page)).not.toBeVisible();
    });
  });
});

test.describe("partial existing cookies", { tag: "@ui" }, () => {
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
    await expect(getCookieBanner(page)).toBeVisible();
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
    await expect(oldCookieBanner(page)).toBeVisible();
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

    test("visit new page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(getCookieBanner(page)).toBeVisible();
    });

    test("visit old page", async ({ page, baseURL }) => {
      test.skip(
        (baseURL as string).includes("tna.dblclk.dev"),
        "no old pages available on tna.dblclk.dev",
      );
      await page.goto(oldPagePath);
      // This is incorrect behaviour - the ds-cookie-consent doesn't display if dontShowCookieNotice is set, regardless of whether cookies_policy is or not
      await expect(oldCookieBanner(page)).not.toBeVisible();
    });
  });
});

test.describe("malformed cookies", { tag: "@ui" }, () => {
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
    await expect(getCookieBanner(page)).toBeVisible();
  });

  test("visit old page", async ({ page }) => {
    await page.goto(oldPagePath);
    await expect(oldCookieBanner(page)).toBeVisible();
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

    test("visit new page", async ({ page }) => {
      await page.goto(newPagePath);
      await expect(getCookieBanner(page)).toBeVisible();
    });

    test("visit old page", async ({ page, baseURL }) => {
      test.skip(
        (baseURL as string).includes("tna.dblclk.dev"),
        "no old pages available on tna.dblclk.dev",
      );
      await page.goto(oldPagePath);
      // This is incorrect behaviour - the ds-cookie-consent doesn't display if dontShowCookieNotice is set, regardless of whether cookies_policy is or not
      await expect(oldCookieBanner(page)).not.toBeVisible();
    });
  });
});
