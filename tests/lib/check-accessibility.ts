import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const checkAccessibility: (page: Page) => void = async (page) => {
  await test.step("Check page accessibility", async () => {
    /* Ignore skip links and phase banner (for now) */
    /* TODO: Remove ignore for phase banner once in header */
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude(".tna-skip-link")
      .exclude(".tna-phase-banner")
      .analyze();
    const accessibilityScanViolations = accessibilityScanResults.violations;
    expect(accessibilityScanViolations).toEqual([]);
  });
};

export default checkAccessibility;
