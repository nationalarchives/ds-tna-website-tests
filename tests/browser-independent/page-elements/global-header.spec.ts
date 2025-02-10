import { test, expect } from "@playwright/test";

test(
  "global header has the correct markup after JS is added",
  { tag: ["@smoke", "@wip"] },
  async ({ page }) => {
    await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
    const headerMain = await page.locator(".tna-global-header__main");
    await expect(await headerMain.innerHTML()).toMatchSnapshot();
  },
);
