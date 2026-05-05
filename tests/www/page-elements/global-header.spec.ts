import { test, expect } from "@playwright/test";

test(
  "global header can be opened and closed on mobile",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page, isMobile }) => {
    await page.goto("/");
    const header = await page.getByRole("banner");
    await expect(header).toBeVisible();

    const headerMenuButton = await header.getByRole("button", { name: "Menu" });

    if (isMobile) {
      await expect(headerMenuButton).toBeVisible();
      await expect(
        header.getByRole("navigation", { name: "Primary" }),
      ).not.toBeVisible();
      await expect(
        header.getByRole("navigation", { name: "Secondary" }),
      ).not.toBeVisible();
      await headerMenuButton.click();
    } else {
      await expect(headerMenuButton).not.toBeVisible();
    }

    await expect(
      header.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    await expect(
      header.getByRole("navigation", { name: "Secondary" }),
    ).toBeVisible();

    if (isMobile) {
      await headerMenuButton.click();
      await expect(
        header.getByRole("navigation", { name: "Primary" }),
      ).not.toBeVisible();
      await expect(
        header.getByRole("navigation", { name: "Secondary" }),
      ).not.toBeVisible();
    }
  },
);

test(
  "global header has the correct accessibility tree for desktop and mobile in open and closed states",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ page, isMobile }) => {
    await page.goto("/");
    const header = await page.getByRole("banner");
    const headerMenuButton = await header.getByRole("button", { name: "Menu" });

    if (isMobile) {
      await expect(
        await header.locator(".tna-global-header__main"),
      ).toMatchAriaSnapshot({ name: "closed.aria.yml" });
      await headerMenuButton.click();
    }

    await expect(
      await header.locator(".tna-global-header__main"),
    ).toMatchAriaSnapshot({ name: "open.aria.yml" });
  },
);
