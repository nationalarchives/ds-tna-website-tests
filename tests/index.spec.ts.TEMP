import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("The National Archives");
});

// test("has correct HTML", async ({ browserName, page }) => {
//   test.skip(
//     browserName.toLowerCase() !== "chromium",
//     `Test only for chromium!`,
//   );
//   await page.goto("/");

//   expect(await page.innerHTML(".tna-global-header")).toMatchSnapshot();
// });
