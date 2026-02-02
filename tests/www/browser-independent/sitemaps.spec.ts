import { test, expect } from "@playwright/test";

test("redirect /sitemaps/ to main XML sitemap", async ({ page }) => {
  const response = await page.goto("/sitemaps/");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("application/xml; charset=utf-8");
});

test("main sitemap", async ({ page, context, baseURL }) => {
  context.route("**/*.xsl", (route) => route.abort());
  const response = await page.goto("/sitemap.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("application/xml; charset=utf-8");
  const xmlContent = await response?.text();
  expect(xmlContent).toContain(`<loc>${baseURL}/sitemaps/sitemap_1.xml</loc>`);
  // if (baseURL?.includes("https://www.nationalarchives.gov.uk")) {
  //   expect(xmlContent).toContain(
  //     "<loc>https://www.nationalarchives.gov.uk/sitemap_index.xml</loc>",
  //   );
  // }
});

test("first dynamic pages sitemap", async ({ page, context, baseURL }) => {
  context.route("**/*.xsl", (route) => route.abort());
  const response = await page.goto("/sitemaps/sitemap_1.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("application/xml; charset=utf-8");
  const xmlContent = await response?.text();
  expect(xmlContent).toContain(`<loc>${baseURL}/</loc>`);
  expect(xmlContent).toContain(`<loc>${baseURL}/explore-the-collection/</loc>`);
});

test("non-existant Wagtail sitemap", async ({ page }) => {
  const response = await page.goto("/sitemaps/sitemap_99999.xml");
  const status = await response?.status();
  expect(status).toEqual(404);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/html; charset=utf-8");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test(
  "WordPress sitemap index",
  { tag: ["@requires-wordpress"] },
  async ({ page, context }) => {
    context.route("**/*.xsl", (route) => route.abort());
    const response = await page.goto("/sitemap_index.xml");
    const status = await response?.status();
    expect(status).toEqual(200);
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=UTF-8");
  },
);

test(
  "WordPress page sitemap 1",
  { tag: ["@requires-wordpress"] },
  async ({ page, context }) => {
    context.route("**/*.xsl", (route) => route.abort());
    const response = await page.goto("/page-sitemap.xml");
    const status = await response?.status();
    expect(status).toEqual(200);
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=UTF-8");
  },
);
