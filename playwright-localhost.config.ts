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
  projects:
    config.projects?.map((project) => ({
      ...project,
      testIgnore: [
        ...(project.testIgnore
          ? Array.isArray(project.testIgnore)
            ? project.testIgnore
            : [project.testIgnore]
          : []),
        "wagtail/**/*",
      ],
    })) || [],
});
