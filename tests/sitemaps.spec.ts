import { test, expect } from "@playwright/test";

test.fixme("redirect /sitemaps/ to main XML sitemap", async ({ page }) => {
  page.on("response", async (response) => {});
  const response = await page.goto("/sitemaps/");
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("application/xml; charset=utf-8");
});

test.fixme("main sitemap", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("application/xml; charset=utf-8");
  });
  await page.goto("/sitemap.xml");
});

test.fixme("static pages sitemap", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("application/xml; charset=utf-8");
  });
  await page.goto("/sitemaps/sitemap_1.xml");
});

test.fixme("first dynamic pages sitemap", async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("application/xml; charset=utf-8");
  });
  await page.goto("/sitemaps/sitemap_2.xml");
});

test.fixme("non-existant sitemap", async ({ page }) => {
  const response = await page.goto("/sitemaps/sitemap_99999.xml");
  const status = await response?.status();
  expect(status).toEqual(404);
});
