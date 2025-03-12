import { test, expect } from "@playwright/test";
import acceptAllCookies from "./lib/accept-all-cookies.ts";

acceptAllCookies();

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
