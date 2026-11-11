import { expect, test } from "@playwright/test";

const contentNegotiation = (
  suiteName: string,
  path: string,
  tags: string[],
) => {
  test.describe(suiteName, { tag: tags }, () => {
    test("html", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("markdown", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/markdown");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("invalid", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "invalid/type",
        },
      });
      expect(response.status()).toBe(406);
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("html + markdown", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html, text/markdown",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("html + markdown with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html;q=0.8, text/markdown;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/markdown");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("markdown + html with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.8, text/html;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("no accept header", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("wildcard accept header", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "*/*",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("markdown wildcard with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.8, */*;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("invalid and valid headers", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "invalid/type, text/html",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("invalid and valid headers with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "invalid/type;q=1, text/html;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(response.headers()["vary"]).toContain("Accept");
    });
  });
};

export default contentNegotiation;
