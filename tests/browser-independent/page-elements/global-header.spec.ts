import { test, expect } from "@playwright/test";

test(
  "global header has the correct markup with HTML only",
  { tag: ["@smoke", "@wip"] },
  async ({ page }) => {
    await page.route("**/*", (route) => {
      return ["script", "stylesheet"].includes(route.request().resourceType())
        ? route.abort()
        : route.continue();
    });
    await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
    const headerMain = await page.locator(".tna-global-header__main");
    await expect(await headerMain.innerHTML()).toMatchSnapshot(
      "global-header-html.txt",
    );
  },
);

test(
  "global header has the correct markup after JS is added",
  { tag: ["@smoke", "@wip"] },
  async ({ page }) => {
    await page.goto("/explore-the-collection/");
    const headerMain = await page.locator(".tna-global-header__main");
    await expect(await headerMain.innerHTML()).toMatchSnapshot(
      "global-header-html-with-js.txt",
    );
    // await expect(headerMain).toHaveScreenshot("global-header-html+js.png");
  },
);
