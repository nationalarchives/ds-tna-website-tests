import config from "./playwright.config.ts";
import { defineConfig } from "@playwright/test";

const extraHTTPHeaders: { [key: string]: string } = {};
if (process.env.TEST_WAGTAIL_API_TOKEN) {
  extraHTTPHeaders["Authorization"] =
    `Token ${process.env.TEST_WAGTAIL_API_TOKEN}`;
}

export default defineConfig({
  ...config,
  testDir: "./tests/wagtail",
  use: {
    ...config.use,
    extraHTTPHeaders: { ...config.use?.extraHTTPHeaders, ...extraHTTPHeaders },
    baseURL:
      process.env.TEST_DOMAIN || "https://wagtail.nationalarchives.gov.uk",
  },
});
