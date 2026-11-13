import { expect, test, get } from "@playwright/test";

export const checkResponseIsHtml = async (
  response: get,
  expectVaryHeader: boolean = false,
) => {
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");
  if (expectVaryHeader) {
    expect(response.headers()["vary"]).toContain("Accept");
  }
  const body = await response.text();
  expect(body).toContain("<html");
  expect(body).toContain("</html>");
  expect(body).toContain("<body");
  expect(body).toContain("</body>");
  return body;
};

export const checkResponseIsMarkdown = async (
  response: get,
  expectVaryHeader: boolean = false,
) => {
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/markdown");
  if (expectVaryHeader) {
    expect(response.headers()["vary"]).toContain("Accept");
  }
  const body = await response.text();
  expect(body.trim()).not.toBe("");
  expect(body).not.toContain("<html");
  expect(body).not.toContain("</html>");
  expect(body).not.toContain("<body");
  expect(body).not.toContain("</body>");
  return body;
};

const contentNegotiation = (
  suiteName: string,
  path: string,
  contentMarker: string,
  tags: string[],
) => {
  test.describe(suiteName, { tag: tags }, () => {
    test("empty accept header", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("html", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("html and markdown contain the same resource", async ({ request }) => {
      const [htmlResponse, markdownResponse] = await Promise.all([
        request.get(path, { headers: { accept: "text/html" } }),
        request.get(path, { headers: { accept: "text/markdown" } }),
      ]);
      const htmlBody = await checkResponseIsHtml(htmlResponse, true);
      const markdownBody = await checkResponseIsMarkdown(
        markdownResponse,
        true,
      );
      expect(htmlBody).toContain(contentMarker);
      expect(markdownBody).toContain(contentMarker);
    });

    test("markdown", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown",
        },
      });
      await checkResponseIsMarkdown(response, true);
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
      await checkResponseIsHtml(response, true);
    });

    test("html + markdown with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html;q=0.8, text/markdown;q=0.9",
        },
      });
      await checkResponseIsMarkdown(response, true);
    });

    test("markdown + html with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.8, text/html;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      await checkResponseIsHtml(response, true);
    });

    test("markdown + html with equal q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.8, text/html;q=0.8",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("html excluded with markdown preferred", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html;q=0, text/markdown;q=1",
        },
      });
      await checkResponseIsMarkdown(response, true);
    });

    test("markdown excluded with html preferred", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0, text/html;q=1",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("all formats excluded", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html;q=0, text/markdown;q=0",
        },
      });
      expect(response.status()).toBe(406);
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("no accept header", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      await checkResponseIsHtml(response, true);
    });

    test("wildcard accept header", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "*/*",
        },
      });
      expect(response.status()).toBe(200);
      await checkResponseIsHtml(response, true);
    });

    test("text wildcard accept header", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/*",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("markdown wildcard with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.8, */*;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      await checkResponseIsHtml(response, true);
    });

    test("markdown exclusion with wildcard accept header", async ({
      request,
    }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0, */*;q=1",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("html exclusion with wildcard accept header", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/html;q=0, */*;q=1",
        },
      });
      await checkResponseIsMarkdown(response, true);
    });

    test("specific markdown preference overrides text wildcard", async ({
      request,
    }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.8, text/*;q=0.9",
        },
      });
      await checkResponseIsHtml(response, true);
    });

    test("markdown with minimum positive q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0.001",
        },
      });
      await checkResponseIsMarkdown(response, true);
    });

    test("markdown with q=1", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=1",
        },
      });
      await checkResponseIsMarkdown(response, true);
    });

    test("markdown with q=0", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=0",
        },
      });
      expect(response.status()).toBe(406);
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("markdown with invalid q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=abc",
        },
      });
      expect(response.status()).toBe(406);
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("markdown with out-of-range q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "text/markdown;q=1.1",
        },
      });
      expect(response.status()).toBe(406);
      expect(response.headers()["vary"]).toContain("Accept");
    });

    test("invalid and valid headers", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "invalid/type, text/html",
        },
      });
      expect(response.status()).toBe(200);
      await checkResponseIsHtml(response, true);
    });

    test("invalid and valid headers with q", async ({ request }) => {
      const response = await request.get(path, {
        headers: {
          accept: "invalid/type;q=1, text/markdown;q=0.9",
        },
      });
      expect(response.status()).toBe(200);
      await checkResponseIsMarkdown(response, true);
    });
  });
};

export default contentNegotiation;
