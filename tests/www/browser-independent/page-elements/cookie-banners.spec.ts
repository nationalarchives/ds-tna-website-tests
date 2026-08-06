import { test, expect, Page } from "@playwright/test";

const getCookieBanner = (page: Page) =>
  page.getByRole("region", { name: "Cookies on The National Archives" });

test(
  "has correct accessibility tree",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".tna-cookie-banner")).toMatchAriaSnapshot({
      name: "banner.aria.yml",
    });
  },
);

test(
  "has the correct screenshot",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".tna-cookie-banner")).toHaveScreenshot(
      "cookie-banner.png",
    );
  },
);
