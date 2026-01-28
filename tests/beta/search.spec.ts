import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../../lib/set-cookie-preferences.ts";

acceptAllCookies();

test("search for a page", async ({ page }) => {
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

  await expect(page).toHaveURL(/q=explore\+the\+collection/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for\s+"(explore|the|collection)",\s+"(explore|the|collection)"\s+or\s+"(explore|the|collection)"/,
  );
  await expect((await page.getByRole("article").all()).length).toBeGreaterThan(
    0,
  );

  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for\s+"(explore|the|collection)",\s+"(explore|the|collection)"\s+or\s+"(explore|the|collection)"/,
  );
  await expect((await page.getByRole("article").all()).length).toBeGreaterThan(
    0,
  );
  await page
    .getByLabel("Search The National Archives website")
    .fill('"explore the collection"');
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/q=%22explore\+the\+collection%22/);
  await expect(page.getByRole("main")).toHaveText(
    /Showing ([\d,]+)–([\d,]+) of ([\d,]+) results for\s+"explore the collection"/,
  );
  await expect((await page.getByRole("article").all()).length).toBeGreaterThan(
    0,
  );
});
