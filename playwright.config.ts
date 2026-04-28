import { defineConfig, devices } from "@playwright/test";
require("dotenv").config({ quiet: true });

export const cookiePreferencesSetKey = "dontShowCookieNotice";
export const cookiePreferencesSetKeyOld = "dontShowCookieNotice";

const extraHTTPHeaders: { [key: string]: string } = {};
if (process.env.TEST_ACCESS_HEADER) {
  extraHTTPHeaders["x-external-access-key"] = process.env.TEST_ACCESS_HEADER;
}

let baseURL: string = "https://www.nationalarchives.gov.uk";
let betaBaseURL: string = "https://beta.nationalarchives.gov.uk";
let wagtailApiBaseURL: string =
  "https://wagtail.nationalarchives.gov.uk/api/v2";
let wagtailSchemaBaseURL: string =
  "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/main/schemas";

switch (process.env.ENVIRONMENT) {
  case "localhost":
    baseURL = "https://localhost";
    betaBaseURL = "https://localhost";
    wagtailApiBaseURL = "https://wagtail.localhost/api/v2";
    wagtailSchemaBaseURL = "http://localhost:65493";
    break;

  case "develop":
    baseURL = "https://dev-www.nationalarchives.gov.uk";
    betaBaseURL = "https://dev-beta.nationalarchives.gov.uk";
    wagtailApiBaseURL = "https://dev-wagtail.nationalarchives.gov.uk/api/v2";
    break;

  case "staging":
    baseURL = "https://staging-www.nationalarchives.gov.uk";
    betaBaseURL = "https://staging-beta.nationalarchives.gov.uk";
    wagtailApiBaseURL =
      "https://staging-wagtail.nationalarchives.gov.uk/api/v2";
    break;
}

process.env.WAGTAIL_SCHEMA_BASE_URL = wagtailSchemaBaseURL;

const extraWagtailHTTPHeaders: { [key: string]: string } = {};
if (process.env.TEST_WAGTAIL_API_TOKEN) {
  extraWagtailHTTPHeaders["Authorization"] =
    `Token ${process.env.TEST_WAGTAIL_API_TOKEN}`;
}

const browsers: string[] = [
  "Desktop Chrome",
  "Desktop Firefox",
  "Desktop Safari",
  "Pixel 5",
  "iPhone 12",
];
const headlessBrowser: string = "Desktop Chrome";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 2,
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
    baseURL,
    trace: "on-first-retry",
    extraHTTPHeaders,
    ignoreHTTPSErrors: true,
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
    ...browsers.map((device) => ({
      name: `Main site, ${device}`,
      use: { ...devices[device] },
      testMatch: ["www/**/*.spec.ts"],
      testIgnore: ["www/browser-independent/**/*.spec.ts"],
    })),
    {
      name: "Main site, browser independent",
      use: { ...devices[headlessBrowser] },
      testMatch: ["www/browser-independent/**/*.spec.ts"],
    },
    ...browsers.map((device) => ({
      name: `Beta site, ${device}`,
      use: { ...devices[device], baseURL: betaBaseURL },
      testMatch: ["beta/**/*.spec.ts"],
      testIgnore: ["beta/browser-independent/**/*.spec.ts"],
    })),
    {
      name: "Beta site, browser independent",
      use: { ...devices[headlessBrowser], baseURL: betaBaseURL },
      testMatch: ["beta/browser-independent/**/*.spec.ts"],
    },
    {
      name: "Wagtail API",
      use: {
        ...devices[headlessBrowser],
        baseURL: wagtailApiBaseURL,
        extraHTTPHeaders: { ...extraWagtailHTTPHeaders },
      },
      testMatch: ["wagtail/**/*.spec.ts"],
    },
  ],
});
