import { test, expect } from "@playwright/test";
import { cookiePreferencesSetKey } from "../playwright.config.ts";
import getCookieDomainFromBaseUrl from "./lib/domains.ts";

test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([
    {
      name: cookiePreferencesSetKey,
      value: "true",
      domain: getCookieDomainFromBaseUrl(baseURL),
      path: "/",
    },
  ]);
  await context.addCookies([
    {
      name: "cookies_policy",
      value:
        "%7B%22usage%22%3Atrue%2C%22settings%22%3Atrue%2C%22marketing%22%3Atrue%2C%22essential%22%3Atrue%7D",
      domain: getCookieDomainFromBaseUrl(baseURL),
      path: "/",
    },
  ]);
});

test("search for a page", { tag: ["@wip", "@ui"] }, async ({ page }) => {
  await page.goto("/search/");
  await expect(
    page.getByRole("region", { name: "Cookies on The National Archives" }),
  ).not.toBeVisible();
  await expect(page.locator("h1")).toHaveText(
    /Search The National Archives website/,
  );
  await page
    .getByLabel("Search The National Archives website")
    .fill("domesday");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/\/search\/\?q=domesday/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for "domesday"/,
  );
  // await expect(page.getByRole("article")).toHaveCount(12);
  await expect.poll(() => page.getByRole("article").count()).toBeGreaterThan(0);

  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for "domesday"/,
  );
  await expect.poll(() => page.getByRole("article").count()).toBeGreaterThan(0);
});
