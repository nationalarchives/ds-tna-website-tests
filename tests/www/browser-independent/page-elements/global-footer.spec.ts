import { test, expect } from "@playwright/test";

test(
  "has the correct accessibility tree",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page }) => {
    await page.goto("/");
    const footer = await page.getByRole("contentinfo");

    await expect(
      footer.getByRole("navigation", { name: "Social" }),
    ).toBeVisible();
    await expect(
      footer.getByRole("navigation", { name: "Quick links" }),
    ).toBeVisible();
    await expect(
      footer.getByRole("navigation", { name: "Other websites" }),
    ).toBeVisible();
    await expect(
      footer.getByRole("navigation", { name: "Legal" }),
    ).toBeVisible();

    await expect(footer).toMatchAriaSnapshot({ name: "full.aria.yml" });
  },
);
