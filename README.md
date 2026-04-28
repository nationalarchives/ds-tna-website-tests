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

| Tag                                  | Purpose                                                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `@wip`                               | Tests that aren't run in the CI                                                                             |
| `@site:www`                          | Main site tests                                                                                             |
| `@site:beta`                         | Beta subdomain tests                                                                                        |
| `@site:wagtail`                      | Wagtail subdomain tests                                                                                     |
| `@service:ds-frontend`               | Tests covering [`ds-frontend`](https://github.com/nationalarchives/ds-frontend)                             |
| `@service:ds-wagtail`                | Tests covering [`ds-wagtail`](https://github.com/nationalarchives/ds-wagtail)                               |
| `@service:ds-catalogue`              | Tests covering [`ds-catalogue`](https://github.com/nationalarchives/ds-catalogue)                           |
| `@service:ds-sitemap-search`         | Tests covering [`ds-sitemap-search`](https://github.com/nationalarchives/ds-sitemap-search)                 |
| `@service:ds-frontend-enrichment`    | Tests covering [`ds-frontend-enrichment`](https://github.com/nationalarchives/ds-frontend-enrichment)       |
| `@service:ds-request-service-record` | Tests covering [`ds-request-service-record`](https://github.com/nationalarchives/ds-request-service-record) |
| `@service:wordpress`                 | Tests that require WordPress to run                                                                         |

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
      run: gh workflow run manual.yml --repo nationalarchives/ds-tna-website-tests --raw-field environment=production --raw-field notify-slack=true
```
