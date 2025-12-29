import { faker } from "@faker-js/faker";

import { sleep } from "@/lib/utils";

export function createFolder() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 1, max: 3 }),
    description: faker.lorem.sentence(),
    linksCount: faker.number.int({ min: 0, max: 120 }),
    dateCreated: faker.date.past({ years: 2 }),
  };
}

export async function fetchFolders() {
  await sleep(0);
  return faker.helpers.multiple(createFolder, { count: 5 });
}

export type Folder = ReturnType<typeof createFolder>;
