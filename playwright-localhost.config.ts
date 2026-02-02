import config from "./playwright.config.ts";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...config,
  testDir: "./tests",
  // maxFailures: 1,
  use: {
    ...config.use,
    baseURL: process.env.TEST_DOMAIN || "https://localhost",
  },
});
