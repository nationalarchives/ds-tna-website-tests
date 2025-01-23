import { test, expect } from "@playwright/test";
import validateHtml from "../lib/validate-html";
import checkAccessibility from "../lib/check-accessibility";

test.fixme("feeds listing page", async ({ page }) => {
  await page.goto("/blog/feeds/");
  await expect(page.locator("h1")).toHaveText(/Blog feeds/);
  await validateHtml(page);
  await checkAccessibility(page);
});

test.fixme("all feed - rss", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/all/");
});

test.fixme("all feed - atom", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/all/?format=atom");
});

test.fixme("explore the collection feed - rss", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/427/");
});

test.fixme("explore the collection feed - atom", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/427/?format=atom");
});
