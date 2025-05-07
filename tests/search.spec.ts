import { test, expect } from "@playwright/test";
import acceptAllCookies from "./lib/accept-all-cookies.ts";

acceptAllCookies();

test("search for a page", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/search/");
  await expect(
    page.getByRole("region", { name: "Cookies on The National Archives" }),
  ).not.toBeVisible();
  await expect(page.locator("h1")).toHaveText(
    /Search The National Archives website/,
  );
  await page
    .getByLabel("Search The National Archives website")
    .fill("explore the collection");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/\/search\/\?q=explore\+the\+collection/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for "explore the collection"/,
  );
  // await expect(page.getByRole("article")).toHaveCount(12);
  await expect.poll(() => page.getByRole("article").count()).toBeGreaterThan(0);

  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for "explore the collection"/,
  );
  await expect.poll(() => page.getByRole("article").count()).toBeGreaterThan(0);
});
