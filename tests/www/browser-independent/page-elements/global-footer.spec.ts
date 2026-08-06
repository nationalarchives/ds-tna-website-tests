import { test, expect } from "@playwright/test";

test(
  "has the correct accessibility tree",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.goto("/");
    const footer = await page.locator(".tna-footer");
    await expect(footer).toMatchAriaSnapshot({
      name: "footer.aria.yml",
    });
  },
);

test(
  "has the correct screenshot",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.goto("/");
    const footer = await page.locator(".tna-footer");
    await expect(footer).toHaveScreenshot("global-footer.png");
  },
);

test(
  "has the correct screenshot with no JS or CSS",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.route("**/*", (route) => {
      return ["script", "stylesheet"].includes(route.request().resourceType())
        ? route.abort()
        : route.continue();
    });
    await page.goto("/");
    const footer = await page.locator(".tna-footer");
    await expect(footer).toHaveScreenshot("global-footer.png");
  },
);
