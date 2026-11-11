import { test, expect } from "@playwright/test";

test(
  "robots.txt",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/robots.txt");
    await expect(response?.ok()).toBeTruthy();
    await expect(response?.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toEqual("text/plain; charset=utf-8");
  },
);

test(
  "llms.txt",
  { tag: ["@site:www", "@service:ds-frontend"] },
  async ({ request }) => {
    const response = await request.get("/llms.txt");
    await expect(response?.ok()).toBeTruthy();
    await expect(response?.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toEqual("text/plain; charset=utf-8");
  },
);
