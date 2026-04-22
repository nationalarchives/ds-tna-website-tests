import { test, expect, Page, APIRequestContext } from "@playwright/test";
import Ajv from "ajv/dist/2020.js";
import {ErrorObject} from "ajv";


const schemaUrls: { [key: string]: string } = {
  pagesSchema: "https://raw.githubusercontent.com/nationalarchives/ds-api-json-schemas/refs/heads/initial-commit/schemas/wagtail/pages.schema.json",
  pagesItemSchema: "https://raw.githubusercontent.com/nationalarchives/ds-api-json-schemas/refs/heads/initial-commit/schemas/wagtail/pages-item.schema.json",
};


class JsonSchemaValidator {
  private _initialised: boolean = false;
  public schemas: { [key: string]: object } = {};

  public constructor() {
  }
  
  public async init() {
    if (this._initialised) {
      return;
    }
    const schemaKeys = Object.keys(schemaUrls);
    const schemaPromises = schemaKeys.map(async (key) => {
      const response = await fetch(schemaUrls[key]);
      const schema = await response.json();
      return { key, schema };
    });
    const schemas = await Promise.all(schemaPromises);
    schemas.forEach(({ key, schema }) => {
      this.schemas[key] = schema;
    });
    this._initialised = true;
  }

  public async validateData(data: any, schemaKey: string): Promise<void> {
    if (!this._initialised) {
      throw new Error("JsonSchemaValidator not initialised. Call init() before validating data.");
    }
    const schema = this.schemas[schemaKey];
    console.log(`Validating data against schema with key: ${schemaKey}`);
    console.log(this.schemas);
    if (!schema) {
      throw new Error(`Schema with key "${schemaKey}" not found.`);
    }
    const ajv = new Ajv();
    for (const key in this.schemas) {
      ajv.addSchema(this.schemas[key]);
    }
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      console.error(validate.errors);
    }
    await expect(validate.errors).toEqual(null);
  }
}



// const validateJsonSchema: (
//   request: APIRequestContext,
//   apiUrl: string,
//   schema: object,
// ) => void = async (request, apiUrl, schema) => {
//   await test.step("Validate JSON schema", async () => {
//     const validator = JsonSchemaValidator.getInstance();
//     const { ajv } = validator;

//     const response = await request.get(apiUrl);
//     await expect(response).toBeOK();
//     const contentType = await response?.headers()["content-type"];
//     await expect(contentType).toEqual("application/json");
//     const jsonContent = await response?.json();

//     const validate = ajv.compile(schema);
//     const valid = validate(jsonContent);
//     if (!valid && validate.errors) {
//       console.error(validate.errors);
//     }
//     await expect(valid).toBeTruthy();
//   });
// };

export {JsonSchemaValidator};