# The National Archives website tests

[![Last test run](https://img.shields.io/github/actions/workflow/status/nationalarchives/ds-tna-website-tests/test.yml?style=flat-square&branch=main&label=latest%20run)](https://github.com/nationalarchives/ds-tna-website-tests/actions/workflows/test.yml)

## Quickstart

```sh
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run the tests against the live site
npm run test:production
```

## Writing tests

### Single-broswer tests

For tests that _shouldn't_ change between browsers, place the tests in the `tests/browser-independent` directory. These tests will only be run against Chrome on desktop and mobile.

These tests include checking redirects, content on the page, the validitiy of HTML or the automated accessibility tests.

### Tags

| Tag      | Purpose                                                                        |
| -------- | ------------------------------------------------------------------------------ |
| `@dev`   | Tests still in development that probably won't work on the production site yet |
| `@smoke` | Smoke tests to check the most basic site functionality                         |
| `@ui`    | Tests for the UI which handle display and interaction                          |
| `@a11y`  | Automated accessibility tests                                                  |
