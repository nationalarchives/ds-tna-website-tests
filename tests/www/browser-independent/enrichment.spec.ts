import { test, expect } from "@playwright/test";
import { acceptAllCookies } from "../../lib/set-cookie-preferences.ts";

acceptAllCookies();

test(
  "logo adornments CSS",
  { tag: ["@site:www", "@service:ds-frontend-enrichment"] },
  async ({ page }) => {
    const response = await page.goto("/enrichment/css/logo-adornments.css");
    await expect(response?.ok()).toBeTruthy();
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/css; charset=UTF-8");
    const corsHeader = await response?.headerValue(
      "Access-Control-Allow-Origin",
    );
    expect(corsHeader).toEqual("*");
  },
);

test(
  "logo adornments JS",
  { tag: ["@site:www", "@service:ds-frontend-enrichment"] },
  async ({ page }) => {
    const response = await page.goto("/enrichment/js/logo-adornments.js");
    await expect(response?.ok()).toBeTruthy();
    const contentType = await response?.headerValue("content-type");
    expect(contentType).toEqual("text/javascript; charset=UTF-8");
    const corsHeader = await response?.headerValue(
      "Access-Control-Allow-Origin",
    );
    expect(corsHeader).toEqual("*");
  },
);
