import { test, expect } from "@playwright/test";

test(
  "global header can be interacted with and has the correct accessibility tree",
  { tag: ["@a11y"] },
  async ({ page, isMobile }) => {
    await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
    const header = await page.locator(".tna-global-header");
    await expect(header).toBeVisible();

    const headerMenuButton = await header.getByRole("button", { name: "Menu" });

    if (isMobile) {
      await expect(header).toMatchAriaSnapshot(`
        - banner:
          - strong: "Service phase: Beta"
          - paragraph:
            - text: This is a new service. Help us improve it and
            - link "give your feedback (opens in new tab)":
              - /url: https://www.smartsurvey.co.uk/s/DN07V0/?area=header&source=http%3A%2F%2Fdev-www.nationalarchives.gov.uk%2Fexplore-the-collection%2F
            - text: .
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
      - banner:
        - strong: "Service phase: Beta"
        - paragraph:
          - text: This is a new service. Help us improve it and
          - link "give your feedback (opens in new tab)":
            - /url: https://www.smartsurvey.co.uk/s/DN07V0/?area=header&source=http%3A%2F%2Fdev-www.nationalarchives.gov.uk%2Fexplore-the-collection%2F
          - text: .
        - link "The National Archives home page":
          - /url: /
        - navigation "Primary":
          - list:
            - listitem:
              - link "Visit"
            - listitem:
              - link "What’s on"
            - listitem:
              - link "Explore the collection"
            - listitem:
              - link "Help using the archive"
            - listitem:
              - link "Education"
            - listitem:
              - link "Professional guidance and services"
        - navigation "Secondary":
          - list:
            - listitem:
              - link "Search"
            - listitem:
              - link "Shop"
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
