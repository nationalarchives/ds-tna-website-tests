import spotCheck from "../../lib/spot-check";
import { SpotCheck } from "../../lib/types";

const urlsToTest: SpotCheck[] = [
  { url: "/explore-the-collection/" },
  { url: "/explore-the-collection/stories/" },
  { url: "/explore-the-collection/stories/?page=2" },
  { url: "/explore-the-collection/stories/robert-wedderburn/" },
  { url: "/explore-the-collection/stories/sir-henry-coles-rat/" },
  { url: "/explore-the-collection/explore-by-topic/" },
  { url: "/explore-the-collection/explore-by-topic/arts-and-culture/" },
  { url: "/explore-the-collection/explore-by-time-period/second-world-war/" },
  {
    url: "/explore-the-collection/explore-by-time-period/second-world-war/second-world-war-propaganda-posters/",
  },
  { url: "/explore-the-collection/search/" },
  { url: "/people/" },
  { url: "/people/vicky-iglikowski-broad/" },
  { url: "/people/vicky-iglikowski-broad/?page=1" },
  // { url: "/mi5-official-secrets/" },
  { url: "/blogs/" },
  { url: "/blogs/feeds/" },
  { url: "/merlin/" },
  { url: "/whats-on/" },
  { url: "/whats-on/events/" },
  // { url: "/whats-on/exhibitions/" },
  // { url: "/professional-guidance-and-services/" },
  // { url: "/professional-guidance-and-services/our-research-and-academic-collaboration/our-research-projects/" },
  { url: "/request-a-military-service-record/" },
];

const devUrlsToTest: SpotCheck[] = [
  { url: "/about-us/" },
  { url: "/about-us/our-role/" },
  { url: "/about-us/our-role/annual-report-and-accounts-202324/" },
  { url: "/about-us/our-role/our-plans/becoming-the-inclusive-archive/" },
];

spotCheck(urlsToTest, devUrlsToTest, ["@www"]);
