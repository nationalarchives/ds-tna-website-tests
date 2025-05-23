import { test, expect } from "@playwright/test";

test("feeds listing page", { tag: ["@wip"] }, async ({ page }) => {
  await page.goto("/blogs/feeds/");
  await expect(page.locator("h1")).toHaveText(/Blog feeds/);
});

test("all feed - rss", { tag: ["@wip", "@smoke"] }, async ({ page }) => {
  const response = await page.goto("/blogs/feeds/all.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/xml; charset=utf-8");
});

test("all feed - atom", { tag: "@wip" }, async ({ page }) => {
  const response = await page.goto("/blogs/feeds/all.xml?format=atom");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/xml; charset=utf-8");
});

test("explore the collection feed - rss", { tag: "@wip" }, async ({ page }) => {
  const response = await page.goto("/blogs/feeds/427.xml");
  const status = await response?.status();
  expect(status).toEqual(200);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/xml; charset=utf-8");
});

test(
  "explore the collection feed - atom",
  { tag: "@wip" },
  async ({ page }) => {
    const response = await page.goto("/blogs/feeds/427.xml?format=atom");
    const status = await response?.status();
    expect(status).toEqual(200);
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  },
);

test("non-existant feed", { tag: "@wip" }, async ({ page }) => {
  const response = await page.goto("/blogs/feeds/0.xml");
  const status = await response?.status();
  expect(status).toEqual(404);
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/html; charset=utf-8");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
