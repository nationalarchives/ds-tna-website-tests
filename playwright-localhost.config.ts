import config from "./playwright.config.ts";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...config,
  testDir: "./tests",
  use: {
    ...config.use,
    baseURL: process.env.TEST_BETA_DOMAIN || "https://localhost",
    ignoreHTTPSErrors: true,
  },
});
