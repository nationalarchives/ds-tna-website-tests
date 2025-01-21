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
```
