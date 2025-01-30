import { test, expect } from "@playwright/test";

test(
  "global header has the correct markup after JS is added",
  { tag: "@smoke" },
  async ({ page }) => {
    await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
    const header = await page.locator(".tna-global-header");
    await expect(await header.innerHTML()).toMatchSnapshot();
  },
);
