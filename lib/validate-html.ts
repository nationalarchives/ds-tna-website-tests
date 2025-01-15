import { test, expect, Page } from "@playwright/test";
import { HtmlValidate, ConfigData } from "html-validate";

const config: ConfigData = {
  extends: ["html-validate:recommended"],
  rules: {
    "attribute-empty-style": ["warn", { style: "omit" }],
    "attribute-boolean-style": ["warn", { style: "omit" }],
    "no-trailing-whitespace": "warn",
  },
};

const htmlvalidate = new HtmlValidate(config);

const validateHtml: (page: Page) => void = async (page) => {
  await test.step("Validate HTML", async () => {
    const html = await page.content();
    const report = await htmlvalidate.validateString(html);

    if (report.errorCount) {
      console.error(`${report.errorCount} errors`);
      report.results[0].messages
        .filter((message) => message.severity === 2)
        .forEach((message) => {
          console.error(message);
        });
    }

    if (report.warningCount) {
      console.log(`${report.warningCount} warnings`);
      report.results[0].messages
        .filter((message) => message.severity === 1)
        .forEach((message) => {
          console.log(message);
        });
    }

    await expect(report).toHaveProperty("valid");
    await expect(report.valid).toBeTruthy();

    await expect(report).toHaveProperty("errorCount");
    await expect(report.errorCount).toEqual(0);

    await expect(report).toHaveProperty("warningCount");
    await expect(report.warningCount).toBeLessThanOrEqual(10);
  });
};

export default validateHtml;
