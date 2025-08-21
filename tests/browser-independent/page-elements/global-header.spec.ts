import { test, expect } from "@playwright/test";

test(
  "global header has the correct markup with HTML only",
  { tag: ["@wip"] },
  async ({ page, baseURL }) => {
    await page.route("**/*", (route) => {
      return ["script", "stylesheet"].includes(route.request().resourceType())
        ? route.abort()
        : route.continue();
    });
    await page.goto("/explore-the-collection/");
    const headerMain = await page.locator(".tna-global-header__main");
    const domainRegEx = new RegExp(baseURL || "", "g");
    const headerMainHtml = (await headerMain.innerHTML()).replace(
      domainRegEx,
      "https://www.nationalarchives.gov.uk",
    );
    await expect(headerMainHtml).toMatchSnapshot("global-header-html.txt");
  },
);

test(
  "global header has the correct markup after JS is added",
  { tag: ["@wip"] },
  async ({ page, baseURL }) => {
    await page.goto("/explore-the-collection/");
    const headerMain = await page.locator(".tna-global-header__main");
    const domainRegEx = new RegExp(baseURL || "", "g");
    const headerMainHtml = (await headerMain.innerHTML()).replace(
      domainRegEx,
      "https://www.nationalarchives.gov.uk",
    );
    await expect(headerMainHtml).toMatchSnapshot(
      "global-header-html-with-js.txt",
    );
    // await expect(headerMain).toHaveScreenshot("global-header-html+js.png");
  },
);
