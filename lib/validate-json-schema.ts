import { expect } from "@playwright/test";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schemas = [
  {
    name: "page",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/page.schema.json",
  },
  {
    name: "pages",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/pages.schema.json",
  },
  {
    name: "pageSummary",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/page-summary.schema.json",
  },
  {
    name: "imageRendition",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/image-rendition.schema.json",
  },
  {
    name: "globalNotifications",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/global-notifications.schema.json",
  },
  {
    name: "globalAlert",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/global-alert.schema.json",
  },
  {
    name: "mourningNotice",
    url: "https://raw.githubusercontent.com/nationalarchives/ds-wagtail/refs/heads/feature/json-schemas/schemas/mourning-notice.schema.json",
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
];

class JsonSchemaValidator {
  private static _initialised: boolean = false;
  private schemas: { name: string; url: string; schema: object }[] = [];

  public constructor() {}

  public async init() {
    if (JsonSchemaValidator._initialised) {
      return;
    }
    this.schemas = await Promise.all(
      schemas.map(async ({ name, url }) => {
        const response = await fetch(url);
        const schema = await response.json();
        return { name, url, schema };
      }),
    );
    JsonSchemaValidator._initialised = true;
  }

  public async validateData(data: object, schema: string): Promise<void> {
    if (!JsonSchemaValidator._initialised) {
      throw new Error(
        "JsonSchemaValidator not initialised. Call init() before validating data.",
      );
    }
    const schemaObj = this.schemas.find((s) => s.name === schema)?.schema;
    if (!schemaObj) {
      throw new Error(`Schema with name "${schema}" not found.`);
    }
    console.log("Data", data);
    console.log("Schema", schemaObj);
    const ajv = new Ajv();
    addFormats(ajv);
    ajv.addSchema(this.schemas.map((s) => s.schema));
    const validate = ajv.compile(schemaObj);
    const valid = validate(data);
    if (!valid) {
      console.error(validate.errors);
    }
    await expect(validate.errors).toEqual(null);
  }
}

export { JsonSchemaValidator };
