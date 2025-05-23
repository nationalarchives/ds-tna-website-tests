import { test, expect } from "@playwright/test";

test(
  "redirect /sitemaps/ to main XML sitemap",
  { tag: ["@wip", "@smoke"] },
  async ({ page }) => {
    const response = await page.goto("/sitemaps/");
    const status = await response?.status();
    expect(status).toEqual(200);
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("application/xml; charset=utf-8");
  },
);

test("main sitemap", { tag: ["@wip", "@smoke"] }, async ({ page }) => {
  const response = await page.goto("/sitemap.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("application/xml; charset=utf-8");
});

test(
  "first dynamic pages sitemap",
  { tag: ["@wip", "@smoke"] },
  async ({ page }) => {
    const response = await page.goto("/sitemaps/sitemap_1.xml");
    const status = await response?.status();
    expect(status).toEqual(200);
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("application/xml; charset=utf-8");
  },
);

test("non-existant sitemap", { tag: "@wip" }, async ({ page }) => {
  const response = await page.goto("/sitemaps/sitemap_99999.xml");
  const status = await response?.status();
  expect(status).toEqual(404);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/html; charset=utf-8");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
