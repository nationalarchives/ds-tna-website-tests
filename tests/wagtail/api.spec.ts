import { test, expect } from "@playwright/test";
import { JsonSchemaValidator } from "../lib/validate-json-schema.ts";

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
  // {
  //   name: "/redirect/",
  //   getUrlFrom: "/api/v2/redirects/?format=json",
  //   getUrlKey: "items.0.meta.detail_url",
  //   schema: "redirect",
  // },
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

apiEndpoints.forEach(({ name, url, getUrlFrom, getUrlKey, schema }) => {
  test(
    name,
    { tag: ["@site:wagtail", "@service:ds-wagtail"] },
    async ({ request, baseURL }) => {
      let response;
      if (url) {
        response = await request.get(url);
      } else if (getUrlFrom && getUrlKey) {
        const preResponse = await fetch(
          `${baseURL?.replace(/\/$/, "")}/${getUrlFrom}`,
        );
        if (preResponse) {
          const preJsonContent = await preResponse.json();
          const urlToTest = getUrlKey
            .split(".")
            .reduce((obj, key) => obj && obj[key], preJsonContent);
          console.log(urlToTest);
          response = await request.get(`${urlToTest}?format=json`);
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
});
