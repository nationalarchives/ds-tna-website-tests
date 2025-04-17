import { defineConfig, devices } from "@playwright/test";

const browserIndependentTests = "browser-independent/**/*.spec.ts";
const browserIndependentDesktopOnlyTests =
  "browser-independent/desktop-only/**/*.spec.ts";

export const cookiePreferencesSetKey = "dontShowCookieNotice";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["dot"],
        ["@estruyf/github-actions-reporter"],
        ["json", { outputFile: "test-results.json" }],
      ]
    : "list",
  use: {
    baseURL: process.env.TEST_DOMAIN || "https://www.nationalarchives.gov.uk",
    ignoreHTTPSErrors: process.env.TEST_DOMAIN === "https://localhost",
    trace: "on-first-retry",
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
      testIgnore: browserIndependentTests,
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
    {
      name: "Browser independent",
      use: { ...devices["Desktop Chrome"] },
      testMatch: browserIndependentTests,
    },
    {
      name: "Browser independent mobile",
      use: { ...devices["Pixel 7"] },
      testMatch: browserIndependentTests,
      testIgnore: browserIndependentDesktopOnlyTests,
    },
  ],
});
