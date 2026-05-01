import { test, expect, Page } from "@playwright/test";

const newPagePath = "/explore-the-collection/";
const getCookieBanner = (page: Page) =>
  page.getByRole("region", { name: "Cookies on The National Archives" });

test(
  "has correct accessibility tree",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.goto(newPagePath);
    await expect(getCookieBanner(page)).toBeVisible();
    await expect(page.locator(".tna-cookie-banner")).toMatchAriaSnapshot({
      name: "full.aria.yml",
    });
  },
);
