import type {
  CreateBookmark,
  CreateBookmarkResponse,
  FindUserBookmarksData,
  FindUserBookmarksResponse,
} from "@keepstash/ts-sdk";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { faker } from "@faker-js/faker";
import { bookmarks } from "@keepstash/ts-sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

import { invalidateByPrefix } from "@/lib/query-client";
import { queryKeysFactory } from "@/lib/query-key-factory";
import { sleep } from "@/lib/utils";

export const bookmarksQueryKeys = queryKeysFactory("bookmarks");

type FindUserBookmarksParams = NonNullable<FindUserBookmarksData["query"]>;

export const useFindUserBookmarks = (
  params?: FindUserBookmarksParams,
  options?: Omit<
    UseQueryOptions<FindUserBookmarksResponse, Error>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery({
    queryKey: bookmarksQueryKeys.list(params ?? {}),
    queryFn: async () => {
      const result = await bookmarks.findUserBookmarks({
        query: params,
      });
      if (result.error) {
        throw result.error;
      }
      if (result.data === undefined) {
        throw new Error("No data returned from findUserBookmarks");
      }
      return result.data;
    },
    ...options,
  });

export const useCreateBookmark = (
  options?: UseMutationOptions<CreateBookmarkResponse, Error, CreateBookmark>
) =>
  useMutation({
    mutationFn: async (payload: CreateBookmark) => {
      const result = await bookmarks.createBookmark({ body: payload });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from createBookmark");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("bookmarks");
    },
    ...options,
  });

// Legacy faker methods (deprecated - use hooks above)
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
  await sleep(0);
  return faker.helpers.multiple(createBookmark, { count: 5 });
}

export type Bookmark = ReturnType<typeof createBookmark>;
