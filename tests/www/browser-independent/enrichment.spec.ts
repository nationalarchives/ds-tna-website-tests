import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../../../lib/set-cookie-preferences.ts";

acceptAllCookies();

test("logo adornments CSS", async ({ page }) => {
  const response = await page.goto("/enrichment/css/logo-adornments.css");
  await expect(response?.ok()).toBeTruthy();
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/css; charset=UTF-8");
});

test("logo adornments JS", async ({ page }) => {
  const response = await page.goto("/enrichment/js/logo-adornments.js");
  await expect(response?.ok()).toBeTruthy();
  const contentType = await response?.headerValue("content-type");
  expect(contentType).toEqual("text/javascript; charset=UTF-8");
});
