import { test, expect } from "@playwright/test";

test("feeds listing page", { tag: ["@wip", "@ui"] }, async ({ page }) => {
  await page.goto("/blog/feeds/");
  await expect(page.locator("h1")).toHaveText(/Blog feeds/);
});

test("all feed - rss", { tag: ["@wip", "@smoke"] }, async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/all/");
});

test("all feed - atom", { tag: "@wip" }, async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/all/?format=atom");
});

test("explore the collection feed - rss", { tag: "@wip" }, async ({ page }) => {
  page.on("response", async (response) => {
    const contentType = await response.headerValue("content-type");
    expect(contentType).toEqual("text/xml; charset=utf-8");
  });
  await page.goto("/blog/feeds/427/");
});

test(
  "explore the collection feed - atom",
  { tag: "@wip" },
  async ({ page }) => {
    page.on("response", async (response) => {
      const contentType = await response.headerValue("content-type");
      expect(contentType).toEqual("text/xml; charset=utf-8");
    });
    await page.goto("/blog/feeds/427/?format=atom");
  },
);
