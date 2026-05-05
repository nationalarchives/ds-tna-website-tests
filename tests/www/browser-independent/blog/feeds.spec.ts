import { test, expect } from "@playwright/test";

test(
  "all feed - rss",
  { tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"] },
  async ({ page }) => {
    const response = await page.goto("/feeds/blogs.xml");
    await expect(response?.ok()).toBeTruthy();
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  },
);

test(
  "all feed - atom",
  { tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"] },
  async ({ page }) => {
    const response = await page.goto("/feeds/blogs.xml?format=atom");
    await expect(response?.ok()).toBeTruthy();
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  },
);

// test("digital blog feed - rss", {tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"]}, async ({ page }) => {
//   const response = await page.goto("/feeds/blogs/414.xml");
// await expect(response?.ok()).toBeTruthy();
//   const contentType = await response?.headerValue("content-type");
//   expect(contentType).toEqual("text/xml; charset=utf-8");
// });

// test("digital blog feed - atom", {tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"]}, async ({ page }) => {
//   const response = await page.goto("/feeds/blogs/414.xml?format=atom");
// await expect(response?.ok()).toBeTruthy();
//   const contentType = await response?.headerValue("content-type");
//   expect(contentType).toEqual("text/xml; charset=utf-8");
// });

test(
  "non-existant feed",
  { tag: ["@site:www", "@service:ds-frontend", "@service:ds-wagtail"] },
  async ({ page }) => {
    const response = await page.goto("/feeds/blogs/0.xml");
    await expect(response?.status()).toEqual(404);
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/html; charset=utf-8");
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  },
);
