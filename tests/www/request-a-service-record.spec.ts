import { test, expect } from "@playwright/test";

test(
  "pages aren't cached in Cloudfront and form data is restored when navigating back",
  { tag: ["@site:www", "@service:ds-request-service-record", "@requires:aws"] },
  async ({ page, context }) => {
    await context.clearCookies();

    // /request-a-military-service-record/
    await page.goto("/request-a-military-service-record/");
    await page.getByRole("button", { name: "Continue" }).click();

    // /request-a-military-service-record/how-we-process-requests/
    await page.getByRole("button", { name: "Continue" }).click();

    // /request-a-military-service-record/before-you-start/
    await page
      .getByRole("checkbox", {
        name: "I confirm I can provide the mandatory information",
      })
      .click();
    await page.getByRole("button", { name: "Start now" }).click();

    // /request-a-military-service-record/you-may-want-to-check-ancestry/
    await page.getByRole("button", { name: "Continue" }).click();

    // /request-a-military-service-record/is-service-person-alive/
    await expect(
      page.getByRole("radio", {
        name: "Yes",
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "No",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "I do not know",
      }),
    ).not.toBeChecked();
    await page.getByRole("radio", { name: "No", exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    // /request-a-military-service-record/which-military-branch-did-the-person-serve-in/
    await page.getByRole("link", { name: "Back", exact: true }).click();

    // /request-a-military-service-record/is-service-person-alive/
    await expect(
      page.getByRole("radio", {
        name: "Yes",
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "No",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "I do not know",
      }),
    ).not.toBeChecked();
    await page.getByRole("radio", { name: "Yes" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    // /request-a-military-service-record/which-military-branch-did-the-person-serve-in/
    await page.getByRole("link", { name: "Back", exact: true }).click();

    // /request-a-military-service-record/is-service-person-alive/
    await expect(
      page.getByRole("radio", {
        name: "Yes",
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "No",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "I do not know",
      }),
    ).not.toBeChecked();
  },
);
