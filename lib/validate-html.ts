import { test, expect, Page } from "@playwright/test";
import { HtmlValidate, ConfigData } from "html-validate";

const defaultHtmlvalidateConfig: ConfigData = {
  extends: ["html-validate:recommended"],
  rules: {
    "attribute-empty-style": ["off", { style: "omit" }],
    "attribute-boolean-style": ["off", { style: "omit" }],
    "no-inline-style": "warn", // video.js
    "no-trailing-whitespace": "off",
    "prefer-native-element": "warn", // video.js
    "script-type": "off", // GTM
  },
};

const htmlvalidate = new HtmlValidate(defaultHtmlvalidateConfig);

const validateHtml: (page: Page, additionalRules?: object) => void = async (
  page,
  additionalRules = {},
) => {
  await test.step("Validate HTML", async () => {
    const html = await page.content();

    let htmlvalidateInstance = htmlvalidate;
    if (Object.keys(additionalRules).length > 0) {
      console.log(
        "Applying additional HTML validation rules:",
        additionalRules,
      );
      const tempConfig = {
        ...defaultHtmlvalidateConfig,
        rules: {
          ...defaultHtmlvalidateConfig.rules,
          ...additionalRules,
        },
      };
      htmlvalidateInstance = new HtmlValidate(tempConfig);
    }

    const report = await htmlvalidateInstance.validateString(html);

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
