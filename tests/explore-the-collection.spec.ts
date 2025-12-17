import { test, expect } from "@playwright/test";

import { acceptAllCookies } from "./lib/set-cookie-preferences.ts";

acceptAllCookies();

test("explore the collection home page", async ({ page }) => {
  await page.goto("/explore-the-collection/");
  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
});

test("search explore the collection", async ({ page }) => {
  await page.goto("/explore-the-collection/search/");
  await expect(page.locator("h1")).toHaveText(/Search Explore the collection/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing [\d,]+–[\d,]+ of [\d,]+ results/,
  );

  const resultsCounts =
    (await page
      .getByText(/Showing [\d,]+–[\d,]+ of [\d,]+ results/)
      .textContent()) || "";
  const results = parseInt((/([\d,]+) results/.exec(resultsCounts) || [])[1]);
  const firstResult = parseInt(
    (/Showing ([\d,]+)/.exec(resultsCounts) || [])[1],
  );
  await expect(results).toBeGreaterThan(0);
  await expect(firstResult).toEqual(1);
  await expect((await page.getByRole("article").all()).length).toBeGreaterThan(
    0,
  );

  await page.getByRole("link", { name: "Next page" }).click();
  const resultsCountsPage2 =
    (await page
      .getByText(/Showing [\d,]+–[\d,]+ of [\d,]+ results/)
      .textContent()) || "";
  const resultsPage2 = parseInt(
    (/([\d,]+) results/.exec(resultsCountsPage2) || [])[1],
  );
  const firstResultPage2 = parseInt(
    (/Showing ([\d,]+)/.exec(resultsCountsPage2) || [])[1],
  );
  await expect(resultsPage2).toEqual(results);
  await expect(firstResultPage2).toEqual(13);

  await page.getByLabel("Search Explore the collection").fill("victoria");
  await page
    .getByRole("search")
    .filter({ hasText: "Search Explore the collection" })
    .getByRole("button")
    .click();
  await expect(page).toHaveURL(
    /\/explore-the-collection\/search\/\?q=victoria/,
  );
  await expect(page.getByRole("main")).toHaveText(
    /Showing [\d,]+–[\d,]+ of [\d,]+ results[\s]+for "victoria"/,
  );
  const resultsCountsWithSearchTerm =
    (await page
      .getByText(/Showing [\d,]+–[\d,]+ of [\d,]+ results/)
      .textContent()) || "";
  const resultsCountWithSearchTerm = parseInt(
    (/([\d,]+) results/.exec(resultsCountsWithSearchTerm) || [])[1],
  );
  const firstResultWithSearchTerm = parseInt(
    (/Showing ([\d,]+)/.exec(resultsCounts) || [])[1],
  );
  await expect(resultsCountWithSearchTerm).toBeGreaterThan(0);
  await expect(resultsCountWithSearchTerm).toBeLessThan(results);
  await expect(firstResultWithSearchTerm).toEqual(1);

  await expect(
    page.getByRole("article").first().locator(".tna-card__meta"),
  ).not.toBeVisible();
  await page.getByLabel("Date published").click();
  await page.getByRole("button", { name: "Update results" }).click();
  await expect(page.getByRole("main")).toHaveText(
    /Showing [\d,]+–[\d,]+ of [\d,]+ results[\s]+for "victoria"/,
  );
  const resultsCountsWithSearchTermAndOrdered =
    (await page
      .getByText(/Showing [\d,]+–[\d,]+ of [\d,]+ results/)
      .textContent()) || "";
  const resultsCountWithSearchTermAndOrdered = parseInt(
    (/([\d,]+) results/.exec(resultsCountsWithSearchTermAndOrdered) || [])[1],
  );
  const firstResultWithSearchTermAndOrdered = parseInt(
    (/Showing ([\d,]+)/.exec(resultsCounts) || [])[1],
  );
  await expect(resultsCountWithSearchTermAndOrdered).toEqual(
    resultsCountWithSearchTerm,
  );
  await expect(firstResultWithSearchTermAndOrdered).toEqual(1);
  await expect(
    page.getByRole("article").first().locator(".tna-card__meta"),
  ).toBeVisible();
});
