import { test } from "@playwright/test";

test("loads page without js", async ({ context, page }) => {
  await context.route(/.js$/, (route) => route.abort());
  await page.goto("/");
  // await page.screenshot({ path: 'no-js.png', fullPage: true });
});
