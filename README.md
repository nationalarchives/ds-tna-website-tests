# The National Archives website tests

[![Last test run](https://img.shields.io/github/actions/workflow/status/nationalarchives/ds-tna-website-tests/test.yml?style=flat-square&branch=main&label=latest%20run)](https://github.com/nationalarchives/ds-tna-website-tests/actions/workflows/test.yml)

## Quickstart

```sh
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run the tests
npx playwright test
```

### Test options

```sh
# Run the tests against a specific site
TEST_DOMAIN=https://dev-www.nationalarchives.gov.uk npx playwright test

# Run the tests with a UI
npx playwright test --ui

# Update the test snapshots
npx playwright test --update-snapshots

# Ignore dev tests
npx playwright test --grep-invert "@dev"
```

## Writing tests

### Single-broswer tests

For tests that _shouldn't_ change between browsers, place the tests in the `tests/browser-independent` directory. These tests will only be run against Chrome on desktop and mobile.

These tests include checking redirects, content on the page, the validitiy of HTML or the automated accessibility tests.

### Development tests

While tests are in development, add the `@dev` tag to the end of the test name:

```js
test("test new unreleased feature @dev", async ({ page }) => {
  // Test a new feature
});

// OR

test("test new unreleased feature", { tag: "@dev" }, async ({ page }) => {
  // Test a new feature
});
```

Once the feature is live, remove the `@dev` tag.
