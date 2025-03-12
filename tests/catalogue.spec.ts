import { test, expect } from "@playwright/test";

import getCookieDomainFromBaseUrl from "./lib/domains.ts";
import { cookiePreferencesSetKey } from "../playwright.config.ts";

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

test("search for records", { tag: ["@wip", "@ui"] }, async ({ page }) => {
  await page.goto("/catalogue/");
  await expect(
    page.getByRole("region", { name: "Cookies on The National Archives" }),
  ).not.toBeVisible();
  await expect(page.locator("h1")).toHaveText(/Welcome to the catalogue/);

  await page.getByLabel("Search the catalogue").fill("plymouth");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/[\?&]q=plymouth/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing results ([\d,]+)–([\d,]+) of ([\d,]+)/,
  );

  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page).toHaveURL(/[\?&]q=plymouth/);
  await expect(page).toHaveURL(/[\?&]page=2/);

  // await page.getByRole("link", { name: "Page 2" }).click();
  // await expect(page).toHaveURL(/[\?&]q=plymouth/);
  // await expect(page).toHaveURL(/[\?&]page=3/);

  await page.getByLabel("Catalogue search results").fill("exeter");
  await page.getByLabel("Catalogue search results").press("Enter");

  await expect(page).toHaveURL(/[\?&]q=exeter/);
  await expect(page).not.toHaveURL(/[\?&]page=2/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing results ([\d,]+)–([\d,]+) of ([\d,]+)/,
  );

  await page.getByLabel("Catalogue search results").fill("");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/[\?&]q=/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing results ([\d,]+)–([\d,]+) of ([\d,]+)/,
  );
});

test(
  "search for and view the details of a record",
  { tag: ["@wip", "@ui"] },
  async ({ page }) => {
    await page.goto("/catalogue/search/?q=ufos");
    await expect(page.getByRole("main")).toHaveText(
      /Showing results ([\d,]+)–([\d,]+) of ([\d,]+)/,
    );
    // await expect(page.getByRole("article")).toHaveCount(20);
    await expect
      .poll(() => page.getByRole("article").count())
      .toBeGreaterThan(0);
    await page.getByRole("article").first().click();

    await expect(page).toHaveURL(new RegExp("/catalogue/id/"));
    await expect(page).toHaveURL(/\?search=/);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.getByRole("main")).toHaveText(
      /Catalogue reference: [\w\d\/ ]+/,
    );
    await expect(page.locator("#record-details")).toBeVisible();
    await expect(page.locator("#record-details-list")).toBeVisible();

    await expect(page.locator(".record-hierarchy")).not.toBeVisible();
    await page.getByRole("button", { name: "Catalogue hierarchy" }).click();
    await expect(page.locator(".record-hierarchy")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Back to search results" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to search results" }).click();
    await expect(page.getByLabel("Catalogue search results")).toHaveValue(
      "ufos",
    );
  },
);
