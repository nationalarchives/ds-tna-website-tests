export type SpotCheck = {
  url: string;
  tags?: string[];
  additionalHtmlvalidateRules?: Record<string, string>;
  disableAccessibilityCheckRules?: string[];
};
