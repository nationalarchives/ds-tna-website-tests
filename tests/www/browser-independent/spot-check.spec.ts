import spotCheck from "../../lib/spot-check";
import { SpotCheck } from "../../lib/types";

const urlsToTest: SpotCheck[] = [
  {
    url: "/explore-the-collection/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/stories/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/stories/?page=2",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/stories/robert-wedderburn/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/stories/sir-henry-coles-rat/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/explore-by-topic/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/explore-by-topic/arts-and-culture/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/explore-by-time-period/second-world-war/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/explore-by-time-period/second-world-war/second-world-war-propaganda-posters/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/explore-the-collection/search/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  { url: "/people/", tags: ["@service:ds-frontend", "@service:ds-wagtail"] },
  {
    url: "/people/vicky-iglikowski-broad/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  {
    url: "/people/vicky-iglikowski-broad/?page=1",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  // { url: "/mi5-official-secrets/" },
  { url: "/blogs/", tags: ["@service:ds-frontend", "@service:ds-wagtail"] },
  {
    url: "/blogs/feeds/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  { url: "/merlin/", tags: ["@service:ds-frontend"] },
  { url: "/whats-on/", tags: ["@service:ds-frontend", "@service:ds-wagtail"] },
  {
    url: "/whats-on/events/",
    tags: ["@service:ds-frontend", "@service:ds-wagtail"],
  },
  // { url: "/whats-on/exhibitions/", tags: ["@service:ds-frontend", "@service:ds-wagtail"] },
  // { url: "/professional-guidance-and-services/", tags: ["@service:ds-frontend", "@service:ds-wagtail"] },
  // { url: "/professional-guidance-and-services/our-research-and-academic-collaboration/our-research-projects/", tags: ["@service:ds-frontend", "@service:ds-wagtail"] },
  {
    url: "/request-a-military-service-record/",
    tags: ["@service:ds-request-service-record"],
  },
];

const devUrlsToTest: SpotCheck[] = [
  { url: "/about-us/" },
  { url: "/about-us/our-role/" },
  { url: "/about-us/our-role/annual-report-and-accounts-202324/" },
  { url: "/about-us/our-role/our-plans/becoming-the-inclusive-archive/" },
];

spotCheck(urlsToTest, devUrlsToTest, ["@site:www"]);
