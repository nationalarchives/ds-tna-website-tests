import { test, expect } from "@playwright/test";

test("feeds listing page", async ({ page }) => {
  await page.goto("/blogs/feeds/");
  await expect(page.locator("h1")).toHaveText(/Blog feeds/);
});

test("all feed - rss", async ({ page }) => {
  const response = await page.goto("/blogs/feeds/all.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/xml; charset=utf-8");
});

test("all feed - atom", async ({ page }) => {
  const response = await page.goto("/blogs/feeds/all.xml?format=atom");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/xml; charset=utf-8");
});

// test("digital blog feed - rss", async ({ page }) => {
//   const response = await page.goto("/blogs/feeds/414.xml");
//   const status = await response?.status();
//   expect(status).toEqual(200);
//   const contentType = await response?.headerValue("content-type");
//   expect(contentType).toEqual("text/xml; charset=utf-8");
// });

// test("digital blog feed - atom", async ({ page }) => {
//   const response = await page.goto("/blogs/feeds/414.xml?format=atom");
//   const status = await response?.status();
//   expect(status).toEqual(200);
//   const contentType = await response?.headerValue("content-type");
//   expect(contentType).toEqual("text/xml; charset=utf-8");
// });

test("non-existant feed", async ({ page }) => {
  const response = await page.goto("/blogs/feeds/0.xml");
  const status = await response?.status();
  expect(status).toEqual(404);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/html; charset=utf-8");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
