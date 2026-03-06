import { test, expect, Page } from "@playwright/test";

const newPagePath = "/explore-the-collection/";
const getCookieBanner = (page: Page) =>
  page.getByRole("region", { name: "Cookies on The National Archives" });

test("cookie banner has correct accessibility tree", async ({ page }) => {
  await page.goto(newPagePath);
  await expect(getCookieBanner(page)).toBeVisible();
  await expect(page.locator(".tna-cookie-banner")).toMatchAriaSnapshot(`
    - region "Cookies on The National Archives":
      - heading "This website uses cookies" [level=2]
      - paragraph: We use some essential cookies to make this service work.
      - paragraph: We'd also like to use analytics cookies so we can understand how you use the service and make improvements.
      - button "Accept cookies"
      - button "Reject cookies"
      - link "Set cookie preferences"
  `);
});
