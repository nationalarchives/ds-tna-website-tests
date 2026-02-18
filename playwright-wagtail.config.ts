import config from "./playwright.config.ts";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...config,
  testDir: "./tests/wagtail",
  use: {
    ...config.use,
    baseURL:
      process.env.TEST_DOMAIN || "https://wagtail.nationalarchives.gov.uk",
  },
});
