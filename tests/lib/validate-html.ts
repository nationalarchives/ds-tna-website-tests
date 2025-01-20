import { test, expect, Page } from "@playwright/test";
import { HtmlValidate, ConfigData } from "html-validate";

const config: ConfigData = {
  extends: ["html-validate:recommended"],
  rules: {
    // "attribute-empty-style": ["warn", { style: "omit" }],
    "attribute-empty-style": ["off", { style: "omit" }],
    // "attribute-boolean-style": ["warn", { style: "omit" }],
    "attribute-boolean-style": ["off", { style: "omit" }],
    "no-trailing-whitespace": "off",
  },
};

const htmlvalidate = new HtmlValidate(config);

const validateHtml: (page: Page) => void = async (page) => {
  await test.step("Validate HTML", async () => {
    const html = await page.content();
    const report = await htmlvalidate.validateString(html);

    const errors =
      report.results[0]?.messages.filter((message) => message.severity === 2) ||
      [];
    await expect(errors).toEqual([]);

    const warnings =
      report.results[0]?.messages.filter((message) => message.severity === 1) ||
      [];
    if (report.warningCount) {
      console.log(`${report.warningCount} warnings`);
      warnings.forEach((message) => {
        console.log(message);
      });
    }
    await expect(report.warningCount).toBeLessThanOrEqual(10);

    await expect(report.valid).toBeTruthy();
  });
};

export default validateHtml;
