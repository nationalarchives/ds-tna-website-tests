import spotCheck from "../../../lib/spot-check";
import { SpotCheck } from "../../../lib/types";

const urlsToTest: SpotCheck[] = [
  {
    url: "/catalogue/",
  },
];

const devUrlsToTest: SpotCheck[] = [
  {
    url: "/catalogue/search/",
    additionalHtmlvalidateRules: {
      "form-dup-name": "off",
    },
  },
  {
    url: "/catalogue/search/?q=ufos",
    additionalHtmlvalidateRules: {
      "form-dup-name": "off",
    },
  },
  {
    url: "/catalogue/search/?filter_list=longSubject",
  },
  {
    url: "/catalogue/id/C4/",
  },
];

spotCheck(urlsToTest, devUrlsToTest);
