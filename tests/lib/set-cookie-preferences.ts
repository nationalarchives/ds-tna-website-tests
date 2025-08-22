import { test } from "@playwright/test";
import getCookieDomainFromBaseUrl from "./domains.ts";
import { cookiePreferencesSetKey } from "../../playwright.config.ts";

const setCookiePolicy = async (
  context,
  baseURL,
  settings: boolean,
  usage: boolean,
  marketing: boolean,
  preferencesSet: boolean = true,
) => {
  await context.clearCookies();
  if (preferencesSet) {
    await context.addCookies([
      {
        name: cookiePreferencesSetKey,
        value: "true",
        domain: getCookieDomainFromBaseUrl(baseURL),
        path: "/",
      },
    ]);
  }
  await context.addCookies([
    {
      name: "cookies_policy",
      value: `%7B%22usage%22%3A${usage.toString()}%2C%22settings%22%3A${settings.toString()}%2C%22marketing%22%3A${marketing.toString()}%2C%22essential%22%3Atrue%7D`,
      domain: getCookieDomainFromBaseUrl(baseURL),
      path: "/",
    },
  ]);
};

const acceptAllCookies = () => {
  test.beforeEach(async ({ context, baseURL }) => {
    await setCookiePolicy(context, baseURL, true, true, true);
  });
};

const declineAllCookies = () => {
  test.beforeEach(async ({ context, baseURL }) => {
    await setCookiePolicy(context, baseURL, false, false, false);
  });
};

export { acceptAllCookies, declineAllCookies, setCookiePolicy };
