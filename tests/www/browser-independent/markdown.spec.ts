import { test, expect } from "@playwright/test";
import { checkResponseIsMarkdown } from "../../lib/content-negotiation";

test(
  "home page markdown",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/md/");
    await expect(response?.ok()).toBeTruthy();
    await checkResponseIsMarkdown(response, false);
  },
);

test(
  "home page markdown (index.md)",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/index.md");
    await expect(response?.ok()).toBeTruthy();
    await checkResponseIsMarkdown(response, false);
  },
);

test(
  "Wagtail page markdown",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/md/explore-the-collection/");
    await expect(response?.ok()).toBeTruthy();
    await checkResponseIsMarkdown(response, false);
  },
);

test(
  "Wagtail page markdown (index.md)",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/explore-the-collection/index.md");
    await expect(response?.ok()).toBeTruthy();
    await checkResponseIsMarkdown(response, false);
  },
);

test(
  "non-existent page markdown",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/md/foobar/");
    await expect(response?.status()).toBe(404);
  },
);

test(
  "non-existent page markdown (index.md)",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/foobar/index.md");
    await expect(response?.status()).toBe(404);
  },
);
