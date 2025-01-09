import { test } from "@playwright/test";

test("loads page without css", async ({ context, page }) => {
  await context.route(/.css$/, (route) => route.abort());
  await page.goto("/");
  // await page.screenshot({ path: 'no-css.png', fullPage: true });
});
