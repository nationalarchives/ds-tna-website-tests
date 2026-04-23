import { expect } from "@playwright/test";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

class JsonSchemaValidator {
  private static schemas: { name: string; url: string; schema?: object }[] = [
    {
      name: "articleTags",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/article-tags.schema.json",
    },
    {
      name: "blogsIndex",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/blogs-index.schema.json",
    },
    {
      name: "blogsTop",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/blogs-top.schema.json",
    },
    {
      name: "blogs",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/blogs.schema.json",
    },
    {
      name: "catalogueLanding",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/catalogue-landing.schema.json",
    },
    {
      name: "events",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/events.schema.json",
    },
    {
      name: "foi",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/foi.schema.json",
    },
    {
      name: "globalAlert",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/global-alert.schema.json",
    },
    {
      name: "globalNotifications",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/global-notifications.schema.json",
    },
    {
      name: "imageRendition",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/image-rendition.schema.json",
    },
    {
      name: "image",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/image.schema.json",
    },
    {
      name: "images",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/images.schema.json",
    },
    {
      name: "media",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/media.schema.json",
    },
    {
      name: "medias",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/medias.schema.json",
    },
    {
      name: "mourningNotice",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/mourning-notice.schema.json",
    },
    {
      name: "pageSummary",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/page-summary.schema.json",
    },
    {
      name: "page",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/page.schema.json",
    },
    {
      name: "pages",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/pages.schema.json",
    },
    {
      name: "redirect",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/redirect.schema.json",
    },
    {
      name: "redirects",
      url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/redirects.schema.json",
    },
  ];

  public constructor() {}

  public static allSchemasLoaded(): boolean {
    return !JsonSchemaValidator.schemas.some((s) => s.schema === undefined);
  }

  public async init() {
    if (JsonSchemaValidator.allSchemasLoaded()) {
      return;
    }
    await Promise.all(
      JsonSchemaValidator.schemas
        .filter((s) => s.schema === undefined)
        .map(async ({ name, url }) => {
          const response = await fetch(`${url}?buster=${Date.now()}`);
          const schema = await response.json();
          const schemaIndex = JsonSchemaValidator.schemas.findIndex(
            (s) => s.name === name,
          );
          if (schemaIndex !== -1) {
            JsonSchemaValidator.schemas[schemaIndex].schema = schema;
          }
        }),
    );
  }

  public async validateData(data: object, schema: string): Promise<void> {
    if (!JsonSchemaValidator.allSchemasLoaded()) {
      throw new Error(
        "JsonSchemaValidator not initialised. Call init() before validating data.",
      );
    }
    const schemaObj = JsonSchemaValidator.schemas.find(
      (s) => s.name === schema,
    )?.schema;
    if (!schemaObj) {
      throw new Error(`Schema with name "${schema}" not found.`);
    }
    console.log("Data", data);
    console.log("Schema", schemaObj);
    const ajv = new Ajv();
    addFormats(ajv);
    ajv.addSchema(JsonSchemaValidator.schemas.map((s) => s.schema));
    const validate = ajv.compile(schemaObj);
    const valid = validate(data);
    if (!valid) {
      console.error(validate.errors);
    }
    await expect(validate.errors).toEqual(null);
  }
}

export { JsonSchemaValidator };
