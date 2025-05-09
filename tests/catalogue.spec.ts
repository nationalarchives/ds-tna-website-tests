import { test, expect } from "@playwright/test";

import acceptAllCookies from "./lib/accept-all-cookies.ts";

acceptAllCookies();

test("search for records", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/catalogue/");
  await expect(
    page.getByRole("region", { name: "Cookies on The National Archives" }),
  ).not.toBeVisible();
  await expect(page.locator("h1")).toHaveText(/Search our catalogue/);

  await page
    .getByLabel("Search by keyword, place, person, or catalogue reference")
    .fill("plymouth");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/[\?&]q=plymouth/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing results ([\d,]+)–([\d,]+) of ([\d,]+)/,
  );

  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page).toHaveURL(/[\?&]q=plymouth/);
  await expect(page).toHaveURL(/[\?&]page=2/);

  // TODO: This won't be available on mobile
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
});

test(
  "view the details of a record from a search and return to the same search results",
  { tag: ["@wip"] },
  async ({ page }) => {
    await page.goto("/catalogue/search/?q=ufos&display=grid");
    await page.getByRole("article").first().click();

    await expect(page).toHaveURL(new RegExp("/catalogue/id/"));
    await expect(page).toHaveURL(/\?search=/);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.getByRole("main")).toHaveText(
      /Catalogue reference: [\w\d\/ ]+/,
    );

    await expect(
      page.getByRole("link", { name: "Back to search results" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to search results" }).click();
    await expect(page.getByLabel("Catalogue search results")).toHaveValue(
      "ufos",
    );
    await expect(page).toHaveURL(/&display=grid/);
  },
);

test("record details page", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/catalogue/id/C4/");

  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.getByRole("main")).toHaveText(
    /Catalogue reference: [\w\d\/ ]+/,
  );
  await expect(page.locator("#record-details")).toBeVisible();
  await expect(page.locator("#record-details-list")).toBeVisible();
});

test("record details page accordion", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/catalogue/id/C4/");

  await expect(page.locator(".record-hierarchy")).not.toBeVisible();
  await page.getByRole("button", { name: "Catalogue hierarchy" }).click();
  await expect(page.locator(".record-hierarchy")).toBeVisible();
});

test(
  "record details page field descriptions",
  { tag: ["@wip"] },
  async ({ page }) => {
    await page.goto("/catalogue/id/C4/");

    if (await page.locator(".record-details__description").count()) {
      await expect(
        page.locator(".record-details__description").first(),
      ).toBeVisible();
      await page
        .getByRole("checkbox", { name: "Hide field descriptions" })
        .click();
      await expect(
        page.locator(".record-details__description").first(),
      ).not.toBeVisible();
    }
  },
);
