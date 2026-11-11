# The National Archives website tests

<!-- [![Nightly run](https://img.shields.io/github/actions/workflow/status/nationalarchives/ds-tna-website-tests/nightly.yml?style=flat-square&branch=main&label=nightly)](https://github.com/nationalarchives/ds-tna-website-tests/actions/workflows/nightly.yml) [![Last manual run](https://img.shields.io/github/actions/workflow/status/nationalarchives/ds-tna-website-tests/manual.yml?style=flat-square&branch=main&label=latest%20manual%20run)](https://github.com/nationalarchives/ds-tna-website-tests/actions/workflows/manual.yml) -->

## Quickstart

```sh
# Install dependencies
npm install
# Install Playwright and its dependencies
npx playwright install --with-deps

# Run the tests for www.nationalarchives.gov.uk
npm run test:production
# ...or dev-www.nationalarchives.gov.uk
npm run test:develop
```

### Rate limiting

The National Archives website may enforce rate limiting to prevent abuse. If you encounter rate limiting during tests, copy the `.env.example` file to `.env` and fill in the `TEST_ACCESS_HEADER` for your environment.

### Wagtail API key

The Wagtail API key is required to authenticate requests to the Wagtail subdomain of The National Archives website. Copy the `.env.example` file to `.env` and fill in the `TEST_WAGTAIL_API_TOKEN` with the appropriate value for your environment.

### Test configurations

| Test script       | Domain(s)                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `test:localhost`  | `localhost`                                                                                                              |
| `test:develop`    | `dev-www.nationalarchives.gov.uk`, `dev-beta.nationalarchives.gov.uk`, `dev-wagtail.nationalarchives.gov.uk`             |
| `test:staging`    | `staging-www.nationalarchives.gov.uk`, `staging-beta.nationalarchives.gov.uk`, `staging-wagtail.nationalarchives.gov.uk` |
| `test:production` | `www.nationalarchives.gov.uk`, `beta.nationalarchives.gov.uk`, `wagtail.nationalarchives.gov.uk`                         |

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
| `@service:ds-bulk-download`          | Tests covering [`ds-bulk-download`](https://github.com/nationalarchives/ds-bulk-download)                   |
| `@service:wordpress`                 | Tests that require WordPress to run                                                                         |
| `@requires:aws`                      | Tests that require the site to be hosted on AWS infrastructure                                              |

## Updating Playwright

```sh
# Install the latest version of Playwright
npm install @playwright/test@latest

# Install Playwright browsers
npx playwright install --with-deps
```

## Continuous integration

Both test workflows run inside Microsoft's official Playwright Docker image.

The shared `playwright-image.yml` workflow reads the exact `@playwright/test` version from `package-lock.json` and selects the matching `mcr.microsoft.com/playwright:v<version>-noble` image.

The image includes Chromium, Firefox, WebKit and their OS dependencies, so CI does not install browsers or system packages. Project dependencies are still installed with `npm ci`, using the npm download cache provided by `actions/setup-node`.

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
