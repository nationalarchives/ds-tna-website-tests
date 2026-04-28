export type SpotCheck = {
  url: string;
  additionalHtmlvalidateRules?: Record<string, string>;
  disableAccessibilityCheckRules?: string[];
};
