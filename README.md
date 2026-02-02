# The National Archives website tests

<!-- [![Nightly run](https://img.shields.io/github/actions/workflow/status/nationalarchives/ds-tna-website-tests/nightly.yml?style=flat-square&branch=main&label=nightly)](https://github.com/nationalarchives/ds-tna-website-tests/actions/workflows/nightly.yml) [![Last manual run](https://img.shields.io/github/actions/workflow/status/nationalarchives/ds-tna-website-tests/manual.yml?style=flat-square&branch=main&label=latest%20manual%20run)](https://github.com/nationalarchives/ds-tna-website-tests/actions/workflows/manual.yml) -->

## Quickstart

```sh
# Install dependencies
npm install

# Run the tests for www.nationalarchives.gov.uk
npm run test:www:production
```

### Test configurations

| Test script            | Domain                                       |
| ---------------------- | -------------------------------------------- |
| `test:localhost`       | https://localhost                            |
| `test:beta:develop`    | https://dev-beta.nationalarchives.gov.uk     |
| `test:beta:staging`    | https://staging-beta.nationalarchives.gov.uk |
| `test:beta:production` | https://beta.nationalarchives.gov.uk         |
| `test:www:develop`     | https://dev-www.nationalarchives.gov.uk      |
| `test:www:staging`     | https://staging-www.nationalarchives.gov.uk  |
| `test:www:production`  | https://www.nationalarchives.gov.uk          |

## Writing tests

### Single-broswer tests

For tests that _shouldn't_ change between browsers, place the tests in the `tests/browser-independent` directory. These tests will only be run against Chrome on desktop and mobile.

These tests include checking redirects, content on the page, the validitiy of HTML or the automated accessibility tests.

### Tags

| Tag                   | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `@wip`                | Tests that probably won't work on the production site yet |
| `@a11y`               | Automated accessibility tests                             |
| `@requires-wordpress` | Requires WordPress to run (so cannot be tested locally)   |

## Updating Playwright

```sh
# Install the latest version of Playwright
npm install @playwright/test@latest

# Install Playwright browsers
npx playwright install --with-deps
```

## Running these tests from another repo

[Create a PAT](https://github.com/settings/personal-access-tokens) with access to this repository (nationalarchives/ds-tna-website-tests).

Ensure the permissions include:

- **Actions**: Read and write
- **Metadata**: Read-only

Save the PAT in your repository secrets as `ACTIONS_GITHUB_TOKEN_TEST_RUNNER` and add the following to your GitHub workflow, updating the `site` and `environment` variables as necessary:

```yaml
test:
  runs-on: ubuntu-latest
  env:
    GH_TOKEN: ${{ secrets.ACTIONS_GITHUB_TOKEN_TEST_RUNNER }}
  steps:
    - uses: actions/checkout@v6
    - name: Run tests
      run: gh workflow run manual.yml --repo nationalarchives/ds-tna-website-tests --raw-field site=www --raw-field environment=production --raw-field notify-slack=true
```
