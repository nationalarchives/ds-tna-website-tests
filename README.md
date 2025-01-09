# Website E2E Playwright tests

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
