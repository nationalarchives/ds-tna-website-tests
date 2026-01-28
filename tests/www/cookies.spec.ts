import { test, expect, Cookie, Page } from "@playwright/test";
import {
  acceptAllCookies,
  declineAllCookies,
} from "../../lib/set-cookie-preferences.ts";

import { cookiePreferencesSetKey } from "../../playwright.config.ts";

test.describe("no cookie policy set", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("cookies landing page", async ({ context, page }) => {
    page.route("**", (route) => route.continue());

    await page.goto("/cookies/");
    let cookies = await context.cookies();
    let cookiePreferencesSet = await cookies.find(
      (cookie: Cookie) => cookie.name === cookiePreferencesSetKey,
    );
    await expect(cookiePreferencesSet).toBeUndefined();
    let policy = await cookies.find(
      (cookie: Cookie) => cookie.name === "cookies_policy",
    );
    await expect(policy).not.toBeUndefined();
    let policyValues = JSON.parse(
      decodeURIComponent(policy ? policy.value : "{}"),
    );
    await expect(policyValues).toHaveProperty("essential", true);
    await expect(policyValues).toHaveProperty("settings", false);
    await expect(policyValues).toHaveProperty("usage", false);
    await expect(policyValues).toHaveProperty("marketing", false);
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that measure my website use",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that measure my website use",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that remember my settings on the site",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that remember my settings on the site",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that are for marketing purposes",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that are for marketing purposes",
        exact: true,
      }),
    ).toBeChecked();

    await page
      .getByRole("radio", {
        name: "Use cookies that measure my website use",
        exact: true,
      })
      .check();
    await page.getByRole("button", { name: "Save changes" }).click();

    cookies = await context.cookies();
    cookiePreferencesSet = await cookies.find(
      (cookie: Cookie) => cookie.name === cookiePreferencesSetKey,
    );
    await expect(cookiePreferencesSet).not.toBeUndefined();
    if (cookiePreferencesSet) {
      await expect(cookiePreferencesSet.value).toEqual("true");
    }
    policy = await cookies.find(
      (cookie: Cookie) => cookie.name === "cookies_policy",
    );
    await expect(policy).not.toBeUndefined();
    policyValues = JSON.parse(decodeURIComponent(policy ? policy.value : "{}"));
    await expect(policyValues).toHaveProperty("essential", true);
    await expect(policyValues).toHaveProperty("settings", false);
    await expect(policyValues).toHaveProperty("usage", true);
    await expect(policyValues).toHaveProperty("marketing", false);

    await page
      .getByRole("radio", {
        name: "Do not use cookies that measure my website use",
        exact: true,
      })
      .check();
    await page
      .getByRole("radio", {
        name: "Use cookies that remember my settings on the site",
        exact: true,
      })
      .check();
    await page
      .getByRole("radio", {
        name: "Use cookies that are for marketing purposes",
        exact: true,
      })
      .check();
    await page.getByRole("button", { name: "Save changes" }).click();

    cookies = await context.cookies();
    policy = await cookies.find(
      (cookie: Cookie) => cookie.name === "cookies_policy",
    );
    await expect(policy).not.toBeUndefined();
    policyValues = JSON.parse(decodeURIComponent(policy ? policy.value : "{}"));
    await expect(policyValues).toHaveProperty("essential", true);
    await expect(policyValues).toHaveProperty("settings", true);
    await expect(policyValues).toHaveProperty("usage", false);
    await expect(policyValues).toHaveProperty("marketing", true);

    await page.goto("/cookies/?1");
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that measure my website use",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that measure my website use",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that remember my settings on the site",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that remember my settings on the site",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that are for marketing purposes",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that are for marketing purposes",
        exact: true,
      }),
    ).not.toBeChecked();
  });
});

test.describe("previously accepted cookies", () => {
  acceptAllCookies();

  test("cookies landing page", async ({ context, page }) => {
    page.route("**", (route) => route.continue());

    await page.goto("/cookies/?2");
    const cookies = await context.cookies();
    const cookiePreferencesSet = await cookies.find(
      (cookie: Cookie) => cookie.name === cookiePreferencesSetKey,
    );
    await expect(cookiePreferencesSet).not.toBeUndefined();
    if (cookiePreferencesSet) {
      await expect(cookiePreferencesSet.value).toEqual("true");
    }
    const policy = await cookies.find(
      (cookie: Cookie) => cookie.name === "cookies_policy",
    );
    await expect(policy).not.toBeUndefined();
    const policyValues = JSON.parse(
      decodeURIComponent(policy ? policy.value : "{}"),
    );
    await expect(policyValues).toHaveProperty("essential", true);
    await expect(policyValues).toHaveProperty("settings", true);
    await expect(policyValues).toHaveProperty("usage", true);
    await expect(policyValues).toHaveProperty("marketing", true);
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that measure my website use",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that measure my website use",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that remember my settings on the site",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that remember my settings on the site",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that are for marketing purposes",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that are for marketing purposes",
        exact: true,
      }),
    ).not.toBeChecked();
  });
});

test.describe("previously declined cookies", () => {
  declineAllCookies();

  test("cookies landing page", async ({ context, page }) => {
    page.route("**", (route) => route.continue());

    await page.goto("/cookies/?3");
    const cookies = await context.cookies();
    const cookiePreferencesSet = await cookies.find(
      (cookie: Cookie) => cookie.name === cookiePreferencesSetKey,
    );
    await expect(cookiePreferencesSet).not.toBeUndefined();
    if (cookiePreferencesSet) {
      await expect(cookiePreferencesSet.value).toEqual("true");
    }
    const policy = await cookies.find(
      (cookie: Cookie) => cookie.name === "cookies_policy",
    );
    await expect(policy).not.toBeUndefined();
    const policyValues = JSON.parse(
      decodeURIComponent(policy ? policy.value : "{}"),
    );
    await expect(policyValues).toHaveProperty("essential", true);
    await expect(policyValues).toHaveProperty("settings", false);
    await expect(policyValues).toHaveProperty("usage", false);
    await expect(policyValues).toHaveProperty("marketing", false);
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that measure my website use",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that measure my website use",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that remember my settings on the site",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that remember my settings on the site",
        exact: true,
      }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Use cookies that are for marketing purposes",
        exact: true,
      }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("radio", {
        name: "Do not use cookies that are for marketing purposes",
        exact: true,
      }),
    ).toBeChecked();
  });
});
