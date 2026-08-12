import { test, expect, Cookie } from "@playwright/test";

import {
  cookiePreferencesSetKey,
  cookiePreferencesKey,
  cookiePreferencesKeyOld,
  cookiePreferencesSetKeyOld,
} from "../../../playwright.config.ts";

test.use({ javaScriptEnabled: false });

test.describe(
  "no cookie policy set",
  { tag: ["@site:www", "@service:ds-frontend"] },
  () => {
    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    test("setting cookie preferences", async ({ context, page }) => {
      page.route("**", (route) => route.continue());

      const response = await page.goto("/cookies/");
      await expect(response?.ok()).toBeTruthy();
      let cookies = await context.cookies();

      let cookiePreferencesSet = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesSetKey,
      );
      await expect(cookiePreferencesSet).toBeUndefined();
      let policy = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesKey,
      );
      await expect(policy).toBeUndefined();

      let cookiePreferencesSetOld = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesSetKeyOld,
      );
      await expect(cookiePreferencesSetOld).toBeUndefined();
      let policyOld = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesKeyOld,
      );
      await expect(policyOld).toBeUndefined();

      let policyValues = JSON.parse(
        decodeURIComponent(policy ? policy.value : "{}"),
      );
      let policyValuesOld = JSON.parse(
        decodeURIComponent(policyOld ? policyOld.value : "{}"),
      );
      await expect(policyValues).toEqual({});
      await expect(policyValuesOld).toEqual({});
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
          name: "Use cookies that help with communications and marketing",
          exact: true,
        }),
      ).not.toBeChecked();
      await expect(
        page.getByRole("radio", {
          name: "Do not use cookies that help with communications and marketing",
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
      cookiePreferencesSetOld = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesSetKeyOld,
      );
      await expect(cookiePreferencesSetOld).not.toBeUndefined();
      if (cookiePreferencesSetOld) {
        await expect(cookiePreferencesSetOld.value).toEqual("true");
      }
      policy = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesKey,
      );
      await expect(policy).not.toBeUndefined();
      policyOld = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesKeyOld,
      );
      await expect(policyOld).not.toBeUndefined();
      policyValues = JSON.parse(
        decodeURIComponent(policy ? policy.value : "{}"),
      );
      policyValuesOld = JSON.parse(
        decodeURIComponent(policyOld ? policyOld.value : "{}"),
      );
      await expect(policyValues).toHaveProperty("essential", true);
      await expect(policyValues).toHaveProperty("settings", false);
      await expect(policyValues).toHaveProperty("usage", true);
      await expect(policyValues).toHaveProperty("marketing", false);
      await expect(policyValuesOld).toHaveProperty("essential", true);
      await expect(policyValuesOld).toHaveProperty("settings", false);
      await expect(policyValuesOld).toHaveProperty("usage", true);
      await expect(policyValuesOld).toHaveProperty("marketing", false);

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
          name: "Use cookies that help with communications and marketing",
          exact: true,
        })
        .check();
      await page.getByRole("button", { name: "Save changes" }).click();

      cookies = await context.cookies();
      policy = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesKey,
      );
      await expect(policy).not.toBeUndefined();
      policyOld = await cookies.find(
        (cookie: Cookie) => cookie.name === cookiePreferencesKeyOld,
      );
      await expect(policyOld).not.toBeUndefined();
      policyValues = JSON.parse(
        decodeURIComponent(policy ? policy.value : "{}"),
      );
      policyValuesOld = JSON.parse(
        decodeURIComponent(policyOld ? policyOld.value : "{}"),
      );
      await expect(policyValues).toHaveProperty("essential", true);
      await expect(policyValues).toHaveProperty("settings", true);
      await expect(policyValues).toHaveProperty("usage", false);
      await expect(policyValues).toHaveProperty("marketing", true);
      await expect(policyValuesOld).toHaveProperty("essential", true);
      await expect(policyValuesOld).toHaveProperty("settings", true);
      await expect(policyValuesOld).toHaveProperty("usage", false);
      await expect(policyValuesOld).toHaveProperty("marketing", true);

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
          name: "Use cookies that help with communications and marketing",
          exact: true,
        }),
      ).toBeChecked();
      await expect(
        page.getByRole("radio", {
          name: "Do not use cookies that help with communications and marketing",
          exact: true,
        }),
      ).not.toBeChecked();
    });
  },
);
