import { test, expect } from "@playwright/test";
import { JsonSchemaValidator } from "../../../lib/validate-json-schema.ts";

const apiEndpoints = [
  {
    name: "/pages/",
    url: "/api/v2/pages/?format=json",
    schema: "pages",
  },
  {
    name: "/pages/3/",
    url: "/api/v2/pages/3/?format=json",
    schema: "page",
  },
  {
    name: "/globals/notifications/",
    url: "/api/v2/globals/notifications/?format=json",
    schema: "globalNotifications",
  },
  {
    name: "/catalogue/landing/",
    url: "/api/v2/catalogue/landing/?format=json",
    schema: "catalogueLanding",
  },
  {
    name: "/events/",
    url: "/api/v2/events/?format=json",
    schema: "events",
  },
  {
    name: "/foi/",
    url: "/api/v2/foi/?format=json",
    schema: "foi",
  },
  {
    name: "/images/",
    url: "/api/v2/images/?format=json",
    schema: "images",
  },
  {
    name: "/medias/",
    url: "/api/v2/media/?format=json",
    schema: "medias",
  },
  {
    name: "/redirects/",
    url: "/api/v2/redirects/?format=json",
    schema: "redirects",
  },
  // TODO: Single redirect
  {
    name: "/article-tags/",
    url: "/api/v2/article_tags/?tags=medicine&format=json",
    schema: "articleTags",
  },
  {
    name: "/blogs/",
    url: "/api/v2/blogs/?format=json",
    schema: "blogs",
  },
  {
    name: "/blogs/index/",
    url: "/api/v2/blogs/index/?format=json",
    schema: "blogsIndex",
  },
  {
    name: "/blogs/top/",
    url: "/api/v2/blogs/top/?format=json",
    schema: "blogsTop",
  },
];

apiEndpoints.forEach(({ name, url, schema }) => {
  test(name, async ({ request }) => {
    const response = await request.get(url);
    await expect(response).toBeOK();
    await expect(await response?.headers()["content-type"]).toEqual(
      "application/json",
    );
    const jsonContent = await response?.json();
    await expect(jsonContent).toBeTruthy();
    const validator = new JsonSchemaValidator();
    await validator.init();
    await validator.validateData(jsonContent, schema);
  });
});

// const serialisedPageProperties = [
//   "id",
//   "title",
//   "short_title",
//   "page_path",
//   "url",
//   "full_url",
//   "type",
//   "type_label",
//   "first_published_at",
//   "last_published_at",
//   "teaser_text",
//   "teaser_image",
// ];

// test("images", async ({ request }) => {
//   const response = await request.get("/api/v2/images/?format=json");
//   await expect(response).toBeOK();
//   const jsonContent = await response?.json();

//   ["meta", "items"].forEach((property) => {
//     expect(jsonContent).toHaveProperty(property);
//   });

//   ["total_count"].forEach((property) => {
//     expect(jsonContent.meta).toHaveProperty(property);
//   });

//   expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
//     jsonContent.items.length,
//   );

//   if (jsonContent.items.length) {
//     ["id", "title", "tags", "uuid", "jpeg", "webp"].forEach((property) => {
//       expect(jsonContent.items[0]).toHaveProperty(property);
//     });

//     ["jpeg", "webp"].forEach((imageFormat) => {
//       ["url", "full_url", "width", "height"].forEach((property) => {
//         expect(jsonContent.items[0][imageFormat]).toHaveProperty(property);
//       });
//     });

//     const responseSingleItem = await request.get(
//       `/api/v2/images/${jsonContent.items[0].uuid}/?format=json`,
//     );
//     await expect(responseSingleItem).toBeOK();
//     const singleItemJsonContent = await responseSingleItem?.json();

//     [
//       "id",
//       "title",
//       "width",
//       "height",
//       "uuid",
//       "copyright",
//       "tags",
//       "transcription_heading",
//       "transcription",
//       "translation_heading",
//       "translation",
//       "description",
//       "jpeg",
//       "webp",
//     ].forEach((property) => {
//       expect(singleItemJsonContent).toHaveProperty(property);
//     });

//     ["jpeg", "webp"].forEach((imageFormat) => {
//       ["url", "full_url", "width", "height"].forEach((property) => {
//         expect(singleItemJsonContent[imageFormat]).toHaveProperty(property);
//       });
//     });
//   }
// });

// test("media", async ({ request }) => {
//   const response = await request.get("/api/v2/media/?format=json");
//   await expect(response).toBeOK();
//   const jsonContent = await response?.json();

//   ["meta", "items"].forEach((property) => {
//     expect(jsonContent).toHaveProperty(property);
//   });

//   ["total_count"].forEach((property) => {
//     expect(jsonContent.meta).toHaveProperty(property);
//   });

//   expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
//     jsonContent.items.length,
//   );

//   if (jsonContent.items.length) {
//     [
//       "id",
//       "meta",
//       "title",
//       "width",
//       "height",
//       "media_type",
//       "collection",
//       "thumbnail",
//       "uuid",
//       "chapters",
//       "subtitles_file",
//       "subtitles_file_full_url",
//       "chapters_file",
//       "chapters_file_full_url",
//     ].forEach((property) => {
//       expect(jsonContent.items[0]).toHaveProperty(property);
//     });

//     const responseSingleItem = await request.get(
//       `/api/v2/media/${jsonContent.items[0].uuid}/?format=json`,
//     );
//     await expect(responseSingleItem).toBeOK();
//     const singleItemJsonContent = await responseSingleItem?.json();

//     [
//       "id",
//       "meta",
//       "title",
//       "width",
//       "height",
//       "media_type",
//       "collection",
//       "uuid",
//       "url",
//       "full_url",
//       "audio_described_file",
//       "thumbnail",
//       "date",
//       "created_at",
//       "duration",
//       "subtitles_file",
//       "subtitles_file_full_url",
//       "chapters",
//       "chapters_file",
//       "chapters_file_full_url",
//       "mime",
//       "description",
//       "transcript",
//     ].forEach((property) => {
//       expect(singleItemJsonContent).toHaveProperty(property);
//     });
//   }
// });

// test("redirects", async ({ request }) => {
//   const response = await request.get("/api/v2/redirects/?format=json");
//   await expect(response).toBeOK();
//   const jsonContent = await response?.json();

//   ["meta", "items"].forEach((property) => {
//     expect(jsonContent).toHaveProperty(property);
//   });

//   ["total_count"].forEach((property) => {
//     expect(jsonContent.meta).toHaveProperty(property);
//   });

//   expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
//     jsonContent.items.length,
//   );

//   if (jsonContent.items.length) {
//     ["id", "meta", "old_path", "location", "is_permanent"].forEach(
//       (property) => {
//         expect(jsonContent.items[0]).toHaveProperty(property);
//       },
//     );

//     const responseSingleItem = await request.get(
//       `/api/v2/redirects/${jsonContent.items[0].id}/?format=json`,
//     );
//     await expect(responseSingleItem).toBeOK();
//     const singleItemJsonContent = await responseSingleItem?.json();

//     ["id", "meta", "old_path", "location", "is_permanent"].forEach(
//       (property) => {
//         expect(singleItemJsonContent).toHaveProperty(property);
//       },
//     );
//   }
// });

// test("article tags", async ({ request }) => {
//   const responseEmpty = await request.get("/api/v2/article_tags/?format=json");
//   await expect(responseEmpty?.status()).toEqual(400);

//   const response = await request.get(
//     "/api/v2/article_tags/?tags=medicine&format=json",
//   );
//   await expect(response).toBeOK();

//   const jsonContent = await response?.json();
//   expect(jsonContent.length).toBeLessThanOrEqual(3);

//   if (jsonContent.length) {
//     [...serialisedPageProperties, "is_newly_published"].forEach((property) => {
//       expect(jsonContent[0]).toHaveProperty(property);
//     });
//   }
// });

// test("blogs", async ({ request }) => {
//   const response = await request.get("/api/v2/blogs/?format=json");
//   await expect(response).toBeOK();
//   const jsonContent = await response?.json();

//   ["meta", "items"].forEach((property) => {
//     expect(jsonContent).toHaveProperty(property);
//   });

//   ["total_count"].forEach((property) => {
//     expect(jsonContent.meta).toHaveProperty(property);
//   });

//   expect(jsonContent.meta.total_count).toBeGreaterThanOrEqual(
//     jsonContent.items.length,
//   );
//   if (jsonContent.items.length) {
//     serialisedPageProperties.forEach((property) => {
//       expect(jsonContent.items[0]).toHaveProperty(property);
//     });
//   }
// });

// test("blogs - index", async ({ request }) => {
//   const response = await request.get("/api/v2/blogs/index/?format=json");
//   await expect(response).toBeOK();
//   const jsonContent = await response?.json();

//   serialisedPageProperties.forEach((property) => {
//     expect(jsonContent).toHaveProperty(property);
//   });
// });

// test("blogs - top", async ({ request }) => {
//   const response = await request.get("/api/v2/blogs/top/?format=json");
//   await expect(response).toBeOK();
//   const jsonContent = await response?.json();

//   expect(jsonContent.length).toBeGreaterThan(0);
//   if (jsonContent.length) {
//     serialisedPageProperties.forEach((property) => {
//       expect(jsonContent[0]).toHaveProperty(property);
//     });
//   }
// });
