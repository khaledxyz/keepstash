import { faker } from "@faker-js/faker";

import { sleep } from "@/lib/utils";

export function createBookmark() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    url: faker.internet.url(),
    thumbnail: faker.image.url({ width: 800, height: 400 }),
    favicon: `https://www.google.com/s2/favicons?domain=${faker.internet.domainName()}&sz=128`,
    folder: faker.helpers.arrayElement([
      "Research Papers",
      "Design",
      "Development",
      "Articles",
      "Tools",
    ]),
    tags: faker.helpers.arrayElements(
      [
        "Biology",
        "Science",
        "Research",
        "Design",
        "Tutorial",
        "Video",
        "Article",
      ],
      { min: 1, max: 3 }
    ),
    description: faker.lorem.paragraph(),
    dateAdded: faker.date.past({ years: 1 }),
    isRead: faker.datatype.boolean(),
    isFavorite: faker.datatype.boolean(),
  };
}

export async function fetchBookmarks() {
  await sleep();
  return faker.helpers.multiple(createBookmark, { count: 5 });
}

export type Bookmark = ReturnType<typeof createBookmark>;
