import { test, expect } from "@playwright/test";

const serialisedPageProperties = [
  "id",
  "title",
  "short_title",
  "page_path",
  "url",
  "full_url",
  "type",
  "type_label",
  "first_published_at",
  "last_published_at",
  "teaser_text",
  "teaser_image",
];

test("pages", async ({ request }) => {
  const response = await request.get("/api/v2/pages/?format=json");
  await expect(response).toBeOK();
  const contentType = await response?.headers()["content-type"];
  expect(contentType).toEqual("application/json");
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );

  if (jsonContent.items.length) {
    serialisedPageProperties.forEach((property) => {
      expect(jsonContent.items[0]).toHaveProperty(property);
    });
  }

  // Teaser images are optional
  const pageWithTeaserImage = jsonContent.items.find(
    (article: any) => article.teaser_image !== null,
  );
  if (pageWithTeaserImage) {
    ["id", "uuid", "title", "description", "jpeg", "webp"].forEach(
      (property) => {
        expect(pageWithTeaserImage.teaser_image).toHaveProperty(property);
      },
    );

    ["jpeg", "webp"].forEach((imageFormat) => {
      ["url", "full_url", "width", "height"].forEach((property) => {
        expect(pageWithTeaserImage.teaser_image[imageFormat]).toHaveProperty(
          property,
        );
      });
    });
  }

  if (jsonContent.items.length) {
    const singleItemResponse = await request.get(
      `/api/v2/pages/${jsonContent.items[0].id}/?format=json`,
    );
    await expect(singleItemResponse).toBeOK();
    const singleItemJsonContent = await singleItemResponse?.json();

    [
      "id",
      "title",
      "short_title",
      "global_alert",
      "type_label",
      "mourning_notice",
    ].forEach((property) => {
      expect(singleItemJsonContent).toHaveProperty(property);
    });

    expect(singleItemJsonContent).toHaveProperty("meta");
    [
      "type",
      "detail_url",
      "html_url",
      "slug",
      "show_in_menus",
      "seo_title",
      "search_description",
      "first_published_at",
      "alias_of",
      "parent",
      "privacy",
      "last_published_at",
      "url",
      "depth",
      "page_path",
      "teaser_text",
      "teaser_image",
      "teaser_image_square",
      "search_image",
      "twitter_og_title",
      "twitter_og_description",
      "twitter_og_image",
      "breadcrumbs",
    ].forEach((property) => {
      expect(singleItemJsonContent.meta).toHaveProperty(property);
    });
  }
});

test("global notifications", async ({ request }) => {
  const response = await request.get(
    "/api/v2/globals/notifications/?format=json",
  );
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["global_alert", "mourning_notice"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });
});

test("catalogue landing", async ({ request }) => {
  const response = await request.get("/api/v2/catalogue/landing/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["global_alert", "mourning_notice", "explore_the_collection"].forEach(
    (property) => {
      expect(jsonContent).toHaveProperty(property);
    },
  );

  ["top_pages", "latest_articles"].forEach((property) => {
    expect(jsonContent.explore_the_collection).toHaveProperty(property);
  });

  expect(jsonContent.explore_the_collection.top_pages.length).toBeGreaterThan(
    0,
  );
  expect(
    jsonContent.explore_the_collection.latest_articles.length,
  ).toBeGreaterThan(0);
});

test("events", async ({ request }) => {
  const response = await request.get("/api/v2/events/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );
  if (jsonContent.items.length) {
    [
      ...serialisedPageProperties,
      "start_date",
      "end_date",
      "min_price",
      "max_price",
      "short_location",
    ].forEach((property) => {
      expect(jsonContent.items[0]).toHaveProperty(property);
    });
  }
});

test("foi", async ({ request }) => {
  const response = await request.get("/api/v2/foi/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );
  if (jsonContent.items.length) {
    [...serialisedPageProperties, "date", "reference"].forEach((property) => {
      expect(jsonContent.items[0]).toHaveProperty(property);
    });
  }
});

test("images", async ({ request }) => {
  const response = await request.get("/api/v2/images/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );

  if (jsonContent.items.length) {
    ["id", "title", "tags", "uuid", "jpeg", "webp"].forEach((property) => {
      expect(jsonContent.items[0]).toHaveProperty(property);
    });

    ["jpeg", "webp"].forEach((imageFormat) => {
      ["url", "full_url", "width", "height"].forEach((property) => {
        expect(jsonContent.items[0][imageFormat]).toHaveProperty(property);
      });
    });

    const responseSingleItem = await request.get(
      `/api/v2/images/${jsonContent.items[0].uuid}/?format=json`,
    );
    await expect(responseSingleItem).toBeOK();
    const singleItemJsonContent = await responseSingleItem?.json();

    [
      "id",
      "title",
      "width",
      "height",
      "uuid",
      "copyright",
      "tags",
      "transcription_heading",
      "transcription",
      "translation_heading",
      "translation",
      "description",
      "jpeg",
      "webp",
    ].forEach((property) => {
      expect(singleItemJsonContent).toHaveProperty(property);
    });

    ["jpeg", "webp"].forEach((imageFormat) => {
      ["url", "full_url", "width", "height"].forEach((property) => {
        expect(singleItemJsonContent[imageFormat]).toHaveProperty(property);
      });
    });
  }
});

test("media", async ({ request }) => {
  const response = await request.get("/api/v2/media/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );

  if (jsonContent.items.length) {
    [
      "id",
      "meta",
      "title",
      "width",
      "height",
      "media_type",
      "collection",
      "thumbnail",
      "uuid",
      "chapters",
      "subtitles_file",
      "subtitles_file_full_url",
      "chapters_file",
      "chapters_file_full_url",
    ].forEach((property) => {
      expect(jsonContent.items[0]).toHaveProperty(property);
    });

    const responseSingleItem = await request.get(
      `/api/v2/media/${jsonContent.items[0].uuid}/?format=json`,
    );
    await expect(responseSingleItem).toBeOK();
    const singleItemJsonContent = await responseSingleItem?.json();

    [
      "id",
      "meta",
      "title",
      "width",
      "height",
      "media_type",
      "collection",
      "uuid",
      "url",
      "full_url",
      "audio_described_file",
      "thumbnail",
      "date",
      "created_at",
      "duration",
      "subtitles_file",
      "subtitles_file_full_url",
      "chapters",
      "chapters_file",
      "chapters_file_full_url",
      "mime",
      "description",
      "transcript",
    ].forEach((property) => {
      expect(singleItemJsonContent).toHaveProperty(property);
    });
  }
});

test("redirects", async ({ request }) => {
  const response = await request.get("/api/v2/redirects/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );

  if (jsonContent.items.length) {
    ["id", "meta", "old_path", "location", "is_permanent"].forEach(
      (property) => {
        expect(jsonContent.items[0]).toHaveProperty(property);
      },
    );

    const responseSingleItem = await request.get(
      `/api/v2/redirects/${jsonContent.items[0].id}/?format=json`,
    );
    await expect(responseSingleItem).toBeOK();
    const singleItemJsonContent = await responseSingleItem?.json();

    ["id", "meta", "old_path", "location", "is_permanent"].forEach(
      (property) => {
        expect(singleItemJsonContent).toHaveProperty(property);
      },
    );
  }
});

test("article tags", async ({ request }) => {
  const responseEmpty = await request.get("/api/v2/article_tags/?format=json");
  await expect(responseEmpty?.status()).toEqual(400);

  const response = await request.get(
    "/api/v2/article_tags/?tags=medicine&format=json",
  );
  await expect(response).toBeOK();

  const jsonContent = await response?.json();
  expect(jsonContent.length).toBeLessThanOrEqual(3);

  if (jsonContent.length) {
    [...serialisedPageProperties, "is_newly_published"].forEach((property) => {
      expect(jsonContent[0]).toHaveProperty(property);
    });
  }
});

test("blogs", async ({ request }) => {
  const response = await request.get("/api/v2/blogs/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  ["meta", "items"].forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });

  ["total_count"].forEach((property) => {
    expect(jsonContent.meta).toHaveProperty(property);
  });

  expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
    jsonContent.items.length,
  );
  if (jsonContent.items.length) {
    serialisedPageProperties.forEach((property) => {
      expect(jsonContent.items[0]).toHaveProperty(property);
    });
  }
});

test("blogs - index", async ({ request }) => {
  const response = await request.get("/api/v2/blogs/index/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  serialisedPageProperties.forEach((property) => {
    expect(jsonContent).toHaveProperty(property);
  });
});

test("blogs - top", async ({ request }) => {
  const response = await request.get("/api/v2/blogs/top/?format=json");
  await expect(response).toBeOK();
  const jsonContent = await response?.json();

  expect(jsonContent.length).toBeGreaterThan(0);
  if (jsonContent.length) {
    serialisedPageProperties.forEach((property) => {
      expect(jsonContent[0]).toHaveProperty(property);
    });
  }
});
