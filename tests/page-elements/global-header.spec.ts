import { test, expect } from "@playwright/test";

test("global header has the correct markup with HTML only", async ({
  page,
  browserName,
  isMobile,
}) => {
  test.skip(browserName !== "chromium" || isMobile, "desktop chromium only");
  await page.route("**/*", (route) => {
    return ["script", "stylesheet"].includes(route.request().resourceType())
      ? route.abort()
      : route.continue();
  });
  await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
  const header = await page.locator(".tna-global-header");
  // await expect(await header.innerHTML()).toMatchSnapshot();
  // await expect(await header.screenshot()).toMatchSnapshot(
  //   "global-header-plain-html.png",
  // );
});

test("global header has the correct markup after JS is added", async ({
  page,
  browserName,
  isMobile,
}) => {
  test.skip(browserName !== "chromium" || isMobile, "desktop chromium only");
  await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
  const header = await page.locator(".tna-global-header");
  // await expect(await header.innerHTML()).toMatchSnapshot();
});

test("global header can be interacted with and has the correct accessibility tree", async ({
  page,
  isMobile,
}) => {
  await page.goto("/explore-the-collection/"); // TODO: Change to homepage once updated
  const header = await page.locator(".tna-global-header");
  await expect(header).toBeVisible();

  const headerMenuButton = await header.getByRole("button", { name: "Menu" });

  if (isMobile) {
    await expect(header).toMatchAriaSnapshot(`
        - banner:
          - link "The National Archives home page"
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
        - link "The National Archives home page"
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
});
