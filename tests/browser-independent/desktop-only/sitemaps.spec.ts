import { test, expect } from "@playwright/test";

test(
  "redirect /sitemaps/ to main XML sitemap",
  { tag: ["@wip", "@smoke"] },
  async ({ page }) => {
    const response = await page.goto("/sitemaps/");
    // const contentType = await response?.headerValue("content-type");
    // expect(contentType).toEqual("application/xml; charset=utf-8");
    const status = await response?.status();
    expect(status).toEqual(200);
  },
);

test("main sitemap", { tag: ["@wip", "@smoke"] }, async ({ page }) => {
  // page.on("response", async (response) => {
  //   const contentType = await response.headerValue("content-type");
  //   expect(contentType).toEqual("application/xml; charset=utf-8");
  // });
  const response = await page.goto("/sitemap.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
});

test("static pages sitemap", { tag: ["@wip", "@smoke"] }, async ({ page }) => {
  // page.on("response", async (response) => {
  //   const contentType = await response.headerValue("content-type");
  //   expect(contentType).toEqual("application/xml; charset=utf-8");
  // });
  const response = await page.goto("/sitemaps/sitemap_1.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
});

test(
  "first dynamic pages sitemap",
  { tag: ["@wip", "@smoke"] },
  async ({ page }) => {
    // page.on("response", async (response) => {
    //   const contentType = await response.headerValue("content-type");
    //   expect(contentType).toEqual("application/xml; charset=utf-8");
    // });
    const response = await page.goto("/sitemaps/sitemap_2.xml");
    const status = await response?.status();
    expect(status).toEqual(200);
  },
);

test("non-existant sitemap", { tag: "@wip" }, async ({ page }) => {
  const response = await page.goto("/sitemaps/sitemap_99999.xml");
  const status = await response?.status();
  expect(status).toEqual(404);
});
