import { test, expect } from "@playwright/test";

import getCookieDomainFromBaseUrl from "../lib/domains.ts";
import { cookiePreferencesSetKey } from "../../playwright.config";

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

test(
  "search for records using the main search fields",
  { tag: ["@wip", "@ui"] },
  async ({ page }) => {
    await page.goto("/catalogue/");
    await expect(
      page.getByRole("region", { name: "Cookies on The National Archives" }),
    ).not.toBeVisible();
    await expect(page.locator("h1")).toHaveText(/Welcome to the catalogue/);

    await page.getByLabel("Search the catalogue").fill("plymouth");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/[\?&]q=plymouth/);
    await expect(page.getByRole("main")).toHaveText(
      /Showing ([\d,]+) of ([\d,]+)/,
    );

    await page.getByLabel("Catalogue search results").fill("exeter");
    await page.getByLabel("Catalogue search results").press("Enter");
    await expect(page).toHaveURL(/[\?&]q=exeter/);
    await expect(page.getByRole("main")).toHaveText(
      /Showing ([\d,]+) of ([\d,]+)/,
    );

    await page.getByLabel("Catalogue search results").fill("");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/[\?&]q=/);
    await expect(page.getByRole("main")).toHaveText(
      /Showing ([\d,]+) of ([\d,]+)/,
    );
  },
);

test(
  "search for and view the details of a record",
  { tag: ["@wip", "@ui"] },
  async ({ page }) => {
    await page.goto("/catalogue/search/?q=plymouth");
    await expect(page.getByRole("main")).toHaveText(
      /Showing ([\d,]+) of ([\d,]+)/,
    );
    await expect(page.getByRole("article")).toHaveCount(15);
    await page.getByRole("article").first().click();

    await expect(page).toHaveURL(new RegExp("/catalogue/id/"));
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.getByRole("main")).toHaveText(
      /Catalogue reference: [\w\d\/ ]+/,
    );
    await expect(page.locator("#record-details")).toBeVisible();
  },
);
