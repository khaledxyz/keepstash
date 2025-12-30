import { faker } from "@faker-js/faker";

import { sleep } from "@/lib/utils";

export function createTag() {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.word(),
    dateCreated: faker.date.past({ years: 2 }),
  };
}

export async function fetchTags() {
  await sleep(0);
  return faker.helpers.multiple(createTag, { count: 8 });
}

export type Tag = ReturnType<typeof createTag>;
