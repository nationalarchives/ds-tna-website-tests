import { test, expect } from "@playwright/test";
import validateHtml from "../../lib/validate-html";

test("explore the collection without a trailing slash", async ({ page }) => {
  page.on("response", (response) => {
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(400);
    if (response.status() >= 300) {
      response
        .headerValue("location")
        .then((location) =>
          expect(location).toMatch(/\/explore-the-collection\/$/),
        );
    }
  });
  await page.goto("/explore-the-collection");
});

test("explore the collection home page", async ({ page }) => {
  await page.goto("/explore-the-collection/");
  await expect(page.locator("h1")).toHaveText(/Explore the collection/);
  await validateHtml(page);
});
