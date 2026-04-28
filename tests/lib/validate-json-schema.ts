import { expect } from "@playwright/test";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

class JsonSchemaValidator {
  private static wagtailSchemaBaseURL = process.env.WAGTAIL_SCHEMA_BASE_URL;

  private static schemas: { name: string; url: string; schema?: object }[] = [
    {
      name: "articleTags",
      url: "article-tags.schema.json",
    },
    {
      name: "blogsIndex",
      url: "blogs-index.schema.json",
    },
    {
      name: "blogsTop",
      url: "blogs-top.schema.json",
    },
    {
      name: "blogs",
      url: "blogs.schema.json",
    },
    {
      name: "catalogueLanding",
      url: "catalogue-landing.schema.json",
    },
    {
      name: "events",
      url: "events.schema.json",
    },
    {
      name: "foi",
      url: "foi.schema.json",
    },
    {
      name: "globalAlert",
      url: "global-alert.schema.json",
    },
    {
      name: "globalNotifications",
      url: "global-notifications.schema.json",
    },
    {
      name: "imageRendition",
      url: "image-rendition.schema.json",
    },
    {
      name: "image",
      url: "image.schema.json",
    },
    {
      name: "images",
      url: "images.schema.json",
    },
    {
      name: "media",
      url: "media.schema.json",
    },
    {
      name: "medias",
      url: "medias.schema.json",
    },
    {
      name: "mourningNotice",
      url: "mourning-notice.schema.json",
    },
    {
      name: "pageSummary",
      url: "page-summary.schema.json",
    },
    {
      name: "page",
      url: "page.schema.json",
    },
    {
      name: "pages",
      url: "pages.schema.json",
    },
    {
      name: "redirect",
      url: "redirect.schema.json",
    },
    {
      name: "redirects",
      url: "redirects.schema.json",
    },
  ];

  public constructor() {}

  public static allSchemasLoaded(): boolean {
    return !JsonSchemaValidator.schemas.some((s) => s.schema === undefined);
  }

  private async _init() {
    if (JsonSchemaValidator.allSchemasLoaded()) {
      return;
    }
    await Promise.all(
      JsonSchemaValidator.schemas
        .filter((s) => s.schema === undefined)
        .map(async ({ name, url }) => {
          const fullUrl = `${JsonSchemaValidator.wagtailSchemaBaseURL?.trimEnd("/")}/${url}`;
          const response = await fetch(`${fullUrl}?buster=${Date.now()}`);
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
    await this._init();
    const schemaObj = JsonSchemaValidator.schemas.find(
      (s) => s.name === schema,
    )?.schema;
    if (!schemaObj) {
      throw new Error(`Schema with name "${schema}" not found.`);
    }
    const ajv = new Ajv();
    addFormats(ajv);
    ajv.addSchema(JsonSchemaValidator.schemas.map((s) => s.schema));
    const validate = ajv.compile(schemaObj);
    const valid = validate(data);
    if (!valid) {
      console.log(data);
      console.log(schemaObj);
      console.error(validate.errors);
    }
    await expect(validate.errors).toEqual(null);
  }
}

export { JsonSchemaValidator };
