import { test, expect } from "@playwright/test";
import { JsonSchemaValidator } from "../lib/validate-json-schema.ts";

const extractKeyFromObject: (obj: object, key: string) => string = (obj, key) =>
  key.split(".").reduce((obj: any, key: string) => obj && obj[key], obj);

const apiEndpoints = [
  {
    name: "/pages/",
    url: "/api/v2/pages/?format=json",
    schema: "pages",
  },
  {
    name: "/pages/find/?html_path=/",
    url: "/api/v2/pages/find/?html_path=%2F&format=json",
    schema: "page",
  },
  {
    name: "/pages/?type=home.HomePage",
    getUrlFrom: "/api/v2/pages/?type=home.HomePage&format=json",
    getIdKey: "items.0.id",
    getDetailUrl: (id: number | string) =>
      `/api/v2/pages/${id.toString()}/?format=json`,
    schema: "pageType:home.HomePage",
  },
  {
    name: "/globals/notifications/",
    url: "/api/v2/globals/notifications/?format=json",
    schema: "globalNotifications",
  },
  {
    name: "/catalogue/landing/",
    url: "/api/v2/catalogue/landing/?format=json",
    schema: "catalogueLanding",
  },
  {
    name: "/events/",
    url: "/api/v2/events/?format=json",
    schema: "events",
  },
  {
    name: "/foi/",
    url: "/api/v2/foi/?format=json",
    schema: "foi",
  },
  {
    name: "/images/",
    url: "/api/v2/images/?format=json",
    schema: "images",
  },
  {
    name: "/medias/",
    url: "/api/v2/media/?format=json",
    schema: "medias",
  },
  {
    name: "/redirects/",
    url: "/api/v2/redirects/?format=json",
    schema: "redirects",
  },
  {
    name: "/redirect/",
    getUrlFrom: "/api/v2/redirects/?format=json",
    getDetailUrlFromKey: "items.0.meta.detail_url",
    schema: "redirect",
  },
  {
    name: "/article-tags/",
    url: "/api/v2/article_tags/?tags=medicine&format=json",
    schema: "articleTags",
  },
  {
    name: "/blogs/",
    url: "/api/v2/blogs/?format=json",
    schema: "blogs",
  },
  {
    name: "/blogs/index/",
    url: "/api/v2/blogs/index/?format=json",
    schema: "blogsIndex",
  },
  {
    name: "/blogs/top/",
    url: "/api/v2/blogs/top/?format=json",
    schema: "blogsTop",
  },
];

apiEndpoints.forEach(
  ({
    name,
    url,
    getUrlFrom,
    getDetailUrlFromKey,
    getIdKey,
    getDetailUrl,
    schema,
  }) => {
    test(
      name,
      { tag: ["@site:wagtail", "@service:ds-wagtail"] },
      async ({ request, baseURL, extraHTTPHeaders }) => {
        let response;
        if (url) {
          response = await request.get(url, {
            maxRedirects: 0,
          });
          if (response.status() === 301 || response.status() === 302) {
            const newLocation = response
              .headers()
              ["location"]?.replace(/host\.docker\.internal/g, "localhost");
            response = await request.get(newLocation);
          }
        } else if (getUrlFrom) {
          const preResponse = await request.get(
            `${baseURL?.replace(/\/$/, "")}/${getUrlFrom.replace(/^\//, "")}`,
            {
              maxRedirects: 0,
            },
          );
          if (preResponse.status() === 301 || preResponse.status() === 302) {
            const newLocation = preResponse
              .headers()
              ["location"]?.replace(/host\.docker\.internal/g, "localhost");
            response = await request.get(newLocation);
          }
          await expect(preResponse).toBeOK();
          const preTextContent = await preResponse.text();
          const replacedTextContent = preTextContent.replace(
            /host\.docker\.internal/g,
            "localhost",
          );
          const preJsonContent = JSON.parse(replacedTextContent);
          if (getDetailUrlFromKey) {
            const urlToTest = extractKeyFromObject(
              preJsonContent,
              getDetailUrlFromKey,
            );
            response = await request.get(`${urlToTest}?format=json`);
          } else if (getIdKey && getDetailUrl) {
            const id = extractKeyFromObject(preJsonContent, getIdKey);
            const urlToTest = getDetailUrl(id);
            response = await request.get(urlToTest);
          }
        } else {
          throw new Error(`Invalid API endpoint configuration for ${name}`);
        }
        await expect(response).toBeTruthy();
        if (response) {
          await expect(response).toBeOK();
        }
        await expect(await response?.headers()["content-type"]).toEqual(
          "application/json",
        );
        const jsonContent = await response?.json();
        await expect(jsonContent).toBeTruthy();
        const validator = new JsonSchemaValidator();
        await validator.validateData(jsonContent, schema);
      },
    );
  },
);
