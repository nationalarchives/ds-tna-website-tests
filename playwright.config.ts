import { defineConfig, devices } from "@playwright/test";
require("dotenv").config({ quiet: true });

const browserIndependentTests = "browser-independent/**/*.spec.ts";

export const cookiePreferencesSetKey = "dontShowCookieNotice";

const extraHTTPHeaders: { [key: string]: string } = {};
if (process.env.ACCESS_HEADER) {
  extraHTTPHeaders["x-external-access-key"] = process.env.ACCESS_HEADER;
}

export default defineConfig({
  testDir: "./tests/www",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  reporter: process.env.CI
    ? [
        ["dot"],
        [
          "@estruyf/github-actions-reporter",
          {
            useDetails: true,
            showError: true,
          },
        ],
        ["json", { outputFile: "test-results.json" }],
      ]
    : "line",
  use: {
    baseURL: process.env.TEST_DOMAIN || "https://www.nationalarchives.gov.uk",
    trace: "on-first-retry",
    extraHTTPHeaders,
  },
  snapshotPathTemplate:
    "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
  expect: {
    toHaveScreenshot: {
      pathTemplate:
        "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}",
    },
    toMatchAriaSnapshot: {
      pathTemplate:
        "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: browserIndependentTests,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: browserIndependentTests,
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 7"] },
      testIgnore: browserIndependentTests,
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 15"] },
      testIgnore: browserIndependentTests,
    },
  ],
});
