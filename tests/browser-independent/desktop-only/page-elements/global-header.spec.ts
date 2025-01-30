import { test, expect } from "@playwright/test";

test(
  "global header has the correct markup with HTML only",
  { tag: "@smoke" },
  async ({ page }) => {
    await page.route("**/*", (route) => {
      return ["script", "stylesheet"].includes(route.request().resourceType())
        ? route.abort()
        : route.continue();
    });
    await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
    const header = await page.locator(".tna-global-header");
    await expect(await header.innerHTML()).toMatchSnapshot();
    // await expect(await header.screenshot()).toMatchSnapshot(
    //   "global-header-plain-html.png",
    // );
  },
);
