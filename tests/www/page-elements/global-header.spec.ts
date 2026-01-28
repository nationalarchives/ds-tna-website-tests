import { test, expect } from "@playwright/test";

test(
  "global header can be interacted with and has the correct accessibility tree",
  { tag: ["@a11y"] },
  async ({ page, isMobile }) => {
    await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
    const header = await page.locator(".tna-global-header__main");
    await expect(header).toBeVisible();

    const headerMenuButton = await header.getByRole("button", { name: "Menu" });

    if (isMobile) {
      await expect(header).toMatchAriaSnapshot(`
        - link "The National Archives home page":
          - /url: /
        - button "Menu"
      `);
      await expect(headerMenuButton).toBeVisible();
      await expect(
        header.getByRole("navigation", { name: "Primary" }),
      ).not.toBeVisible();
      await expect(
        header.getByRole("navigation", { name: "Secondary" }),
      ).not.toBeVisible();
      // await expect(await header.screenshot()).toMatchSnapshot(
      //   "global-header-mobile.png",
      // );
      await headerMenuButton.click();
      // await expect(await header.screenshot()).toMatchSnapshot(
      //   "global-header-mobile-open.png",
      // );
    } else {
      await expect(headerMenuButton).not.toBeVisible();
      // await expect(await header.screenshot()).toMatchSnapshot(
      //   "global-header.png",
      // );
    }

    await expect(
      header.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    await expect(
      header.getByRole("navigation", { name: "Secondary" }),
    ).toBeVisible();

    await expect(header).toMatchAriaSnapshot(`
      - link "The National Archives home page":
        - /url: /
      - navigation "Primary":
        - list:
          - listitem:
            - link "Visit":
              - /url: /about/visit-us/
          - listitem:
            - link "What’s on":
              - /url: /whats-on/
          - listitem:
            - link "Explore the collection":
              - /url: /explore-the-collection/
          - listitem:
            - link "Help using the archive":
              - /url: /help-with-your-research/
          - listitem:
            - link "Education":
              - /url: /education/
          - listitem:
            - link "Professional guidance and services":
              - /url: /professional-guidance-and-services/
      - navigation "Secondary":
        - list:
          - listitem:
            - link "Search":
              - /url: /search/
          - listitem:
            - link "Shop":
              - /url: https://shop.nationalarchives.gov.uk/
    `);

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
