import { expect, test } from "@playwright/test";
import validateHtml from "./lib/validate-html";
import checkAccessibility from "./lib/check-accessibility";

test.describe("chromium only", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Test for Chromium only",
  );

  test("Page not found error page @dev", async ({ page }) => {
    page.on("response", (response) => {
      if (response.url().endsWith("/foobar/")) {
        expect(response.status()).toEqual(404);
      }
    });
    await page.goto("/foobar/");
    await expect(page).toHaveTitle("The National Archives");
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "contact us" }),
    ).toBeVisible();
    await validateHtml(page);
    await checkAccessibility(page);
  });
});
