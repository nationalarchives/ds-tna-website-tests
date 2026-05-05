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

    // await expect(footer).toMatchAriaSnapshot({ name: "full.aria.yml" });
    await expect(
      await footer.locator(
        "> .tna-footer__inner > .tna-container:nth-child(1)",
      ),
    ).toMatchAriaSnapshot({ name: "first-container.aria.yml" });
    await expect(
      await footer.locator(
        "> .tna-footer__inner > .tna-container:nth-child(2)",
      ),
    ).toMatchAriaSnapshot({ name: "second-container.aria.yml" });
    // TODO: The third container has an absolute link which changes per environment
  },
);
