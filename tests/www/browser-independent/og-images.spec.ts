import { test, expect } from "@playwright/test";

test(
  "home page",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    const response = await page.goto("/og/");
    await expect(response?.ok()).toBeTruthy();
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("image/jpeg");
  },
);

test(
  "Wagtail page",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    const response = await page.goto("/og/explore-the-collection/");
    await expect(response?.ok()).toBeTruthy();
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("image/jpeg");
  },
);

test.describe("other service OG image", { tag: ["@site:www"] }, () => {
  test(
    "Request a Military Service Record",
    { tag: ["@service:ds-request-service-record"] },
    async ({ page }) => {
      const response = await page.goto("/og/request-military-service-record/");
      await expect(response?.ok()).toBeTruthy();
      const contentType = await response?.headerValue("content-type");
      expect(contentType).toEqual("image/jpeg");
    },
  );

  test(
    "bulk download",
    { tag: ["@service:ds-bulk-download"] },
    async ({ page }) => {
      const response = await page.goto("/og/merlin/");
      await expect(response?.ok()).toBeTruthy();
      const contentType = await response?.headerValue("content-type");
      expect(contentType).toEqual("image/jpeg");
    },
  );
});

test("non-existent page", { tag: ["@site:www"] }, async ({ page }) => {
  const response = await page.goto("/og/foobar/");
  await expect(response?.ok()).toBeTruthy();
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("image/jpeg");
});
