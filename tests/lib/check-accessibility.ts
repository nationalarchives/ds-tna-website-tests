import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const checkAccessibility: (page: Page) => void = async (page) => {
  await test.step("Check page accessibility", async () => {
    /* Ignore skip links and phase banner (for now) */
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude(".tna-skip-link")
      .exclude(".tna-phase-banner")
      .analyze();
    const accessibilityScanViolations = accessibilityScanResults.violations;
    // .map((violation) => {
    //   let nodes = violation.nodes;
    //   /* Ignore "Ensure all page content is contained by landmarks" for skip links and phase banners */
    //   if (violation.id === "region") {
    //     nodes = nodes.filter(
    //       (node) =>
    //         node.target.length === 1 &&
    //         !node.target.includes(".tna-skip-link") &&
    //         !node.target.includes(".tna-phase-banner"),
    //     );
    //     if (nodes.length === 0) {
    //       return null;
    //     }
    //   }
    //   return { ...violation, nodes };
    // })
    // .filter((violation) => violation);
    expect(accessibilityScanViolations).toEqual([]);
  });
};

export default checkAccessibility;
