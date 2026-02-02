import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const checkAccessibility: (
  page: Page,
  disableRule?: Array<string>,
) => void = async (page, disableRules = []) => {
  await test.step("Check page accessibility", async () => {
    /* Ignore skip links */
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude(".tna-skip-link")
      .disableRules(disableRules)
      .analyze();
    const accessibilityScanViolations = accessibilityScanResults.violations;
    expect(accessibilityScanViolations).toEqual([]);
  });
};

export default checkAccessibility;
