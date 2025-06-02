const getCookieDomainFromBaseUrl: (baseURL: string | undefined) => string = (
  baseURL = "https://www.nationalarchives.gov.uk",
) => {
  const cookieDomains = {
    "https://www.nationalarchives.gov.uk": ".nationalarchives.gov.uk",
    "https://staging-www.nationalarchives.gov.uk": ".nationalarchives.gov.uk",
    "https://dev-www.nationalarchives.gov.uk": ".nationalarchives.gov.uk",
    "http://localhost:65535": "localhost:65535",
    "https://localhost": "localhost",
    "https://nginx": "nginx",
  };
  if (cookieDomains.hasOwnProperty(baseURL)) {
    return cookieDomains[baseURL];
  }
  return `.${baseURL.replace(/^https?:\/\/(www.)?/, "")}`;
};

export default getCookieDomainFromBaseUrl;
