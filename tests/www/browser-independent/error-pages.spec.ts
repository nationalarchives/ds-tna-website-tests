import { expect, test } from "@playwright/test";
import validateHtml from "../../lib/validate-html";
import checkAccessibility from "../../lib/check-accessibility";

test("page not found error page", async ({ page }) => {
  const response = await page.goto("/foobar/");
  await expect(response?.status()).toEqual(404);
  await expect(page).toHaveTitle("Page not found - The National Archives");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "contact us" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByRole("link", { name: "archived version of this page" }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Discovery" }),
  ).toBeVisible();
  await validateHtml(page);
  await checkAccessibility(page);
});
