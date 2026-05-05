import spotCheck from "../../lib/spot-check";
import { SpotCheck } from "../../lib/types";

const urlsToTest: SpotCheck[] = [
  {
    url: "/catalogue/",
    tags: ["@service:ds-catalogue"],
  },
  // TODO: Re-enable these tests
  {
    url: "/search/",
    tags: ["@service:ds-sitemap-search"],
  },
  {
    url: "/search/?q=ufo",
    tags: ["@service:ds-sitemap-search"],
  },
];

const devUrlsToTest: SpotCheck[] = [
  {
    url: "/catalogue/search/",
    tags: ["@service:ds-catalogue"],
    additionalHtmlvalidateRules: {
      "form-dup-name": "off",
    },
  },
  {
    url: "/catalogue/search/?q=ufos",
    tags: ["@service:ds-catalogue"],
    additionalHtmlvalidateRules: {
      "form-dup-name": "off",
    },
  },
  {
    url: "/catalogue/search/?filter_list=longSubject",
    tags: ["@service:ds-catalogue"],
  },
  {
    url: "/catalogue/id/C4/",
    tags: ["@service:ds-catalogue"],
  },
];

spotCheck(urlsToTest, devUrlsToTest, ["@site:beta"]);
