import { test } from "@playwright/test";
import validateHtml from "../../lib/validate-html";

test("explore the collection stories", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/");
  await validateHtml(page);
});

test("explore the collection stories, page 2", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/?page=2");
  await validateHtml(page);
});

test("article page", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/robert-wedderburn/");
  await validateHtml(page);
});

test("focused article page", async ({ page }) => {
  await page.goto(
    "/explore-the-collection/stories/the-bethnal-green-tube-shelter-disaster/",
  );
  await validateHtml(page);
});

test("record revealed page", async ({ page }) => {
  await page.goto("/explore-the-collection/stories/sir-henry-coles-rat/");
  await validateHtml(page);
});
