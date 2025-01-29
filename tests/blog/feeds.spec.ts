import { test, expect } from "@playwright/test";

test.describe("chromium only", { tag: "@dev" }, () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Test for Chromium only",
  );

  test("feeds listing page", async ({ page }) => {
    await page.goto("/blog/feeds/");
    await expect(page.locator("h1")).toHaveText(/Blog feeds/);
  });

  test("all feed - rss", async ({ page }) => {
    page.on("response", async (response) => {
      const contentType = await response.headerValue("content-type");
      expect(contentType).toEqual("text/xml; charset=utf-8");
    });
    await page.goto("/blog/feeds/all/");
  });

  test("all feed - atom", async ({ page }) => {
    page.on("response", async (response) => {
      const contentType = await response.headerValue("content-type");
      expect(contentType).toEqual("text/xml; charset=utf-8");
    });
    await page.goto("/blog/feeds/all/?format=atom");
  });

  test("explore the collection feed - rss", async ({ page }) => {
    page.on("response", async (response) => {
      const contentType = await response.headerValue("content-type");
      expect(contentType).toEqual("text/xml; charset=utf-8");
    });
    await page.goto("/blog/feeds/427/");
  });

  test("explore the collection feed - atom", async ({ page }) => {
    page.on("response", async (response) => {
      const contentType = await response.headerValue("content-type");
      expect(contentType).toEqual("text/xml; charset=utf-8");
    });
    await page.goto("/blog/feeds/427/?format=atom");
  });
});
