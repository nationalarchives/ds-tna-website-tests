import { test } from "@playwright/test";
import validateHtml from "../lib/validate-html";
import checkAccessibility from "../lib/check-accessibility";

test("explore the collection stories", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/");
  await validateHtml(page);
  await checkAccessibility(page);
});

test("explore the collection stories, page 2", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/?page=2");
  await validateHtml(page);
  await checkAccessibility(page);
});

test.fixme("article page", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/robert-wedderburn/");
  await validateHtml(page);
  await checkAccessibility(page);
});

test.fixme("focused article page", async ({ page }) => {
  await page.goto(
    "/explore-the-collection/stories/the-bethnal-green-tube-shelter-disaster/",
  );
  await validateHtml(page);
  await checkAccessibility(page);
});

test.fixme("record revealed page", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/sir-henry-coles-rat/");
  await validateHtml(page);
  await checkAccessibility(page);
});
