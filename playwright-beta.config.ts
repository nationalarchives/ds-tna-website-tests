import config from "./playwright.config.ts";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...config,
  testDir: "./tests/beta",
  use: {
    ...config.use,
    baseURL:
      process.env.TEST_DOMAIN || "https://beta.nationalarchives.gov.uk",
  },
});
