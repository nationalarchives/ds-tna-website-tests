import { test, expect } from "@playwright/test";

test(
  "explore the collection without a trailing slash",
  { tag: "@smoke" },
  async ({ page }) => {
    // page.on("response", (response) => {
    //   expect(response.status()).toBeGreaterThanOrEqual(200);
    //   expect(response.status()).toBeLessThan(400);
    //   if (response.status() >= 300) {
    //     response
    //       .headerValue("location")
    //       .then((location) =>
    //         expect(location).toMatch(/\/explore-the-collection\/$/),
    //       );
    //   }
    // });
    // await page.goto("/explore-the-collection");
    await page.route("**", async (route) => {
      const response = await route.fetch({ maxRedirects: 0 });
      let headers = response.headers();
      expect(headers.location).toMatch(/\/explore-the-collection\/$/);
      delete headers["location"];
      delete headers["Location"];
      return route.fulfill({
        response: response,
        headers: headers,
      });
    });
    const response = await page.goto("/explore-the-collection");
    const status = await response?.status();
    expect(status).toBeGreaterThanOrEqual(300);
    expect(status).toBeLessThan(400);
  },
);
