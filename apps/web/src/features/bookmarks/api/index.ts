import type {
  CreateBookmark,
  CreateBookmarkResponse,
  DeleteBookmarkResponse,
  FindUserBookmarksData,
  FindUserBookmarksResponse,
  RestoreBookmarkResponse,
  UpdateBookmark,
  UpdateBookmarkResponse,
} from "@keepstash/ts-sdk";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { bookmarks } from "@keepstash/ts-sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

import { invalidateByPrefix } from "@/lib/query-client";
import { queryKeysFactory } from "@/lib/query-key-factory";

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

export const useUpdateBookmark = (
  options?: UseMutationOptions<
    UpdateBookmarkResponse,
    Error,
    { id: string; payload: UpdateBookmark }
  >
) =>
  useMutation({
    mutationFn: async ({ id, payload }) => {
      const result = await bookmarks.updateBookmark({
        path: { id },
        body: payload,
      });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from updateBookmark");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("bookmarks");
    },
    ...options,
  });

export const useDeleteBookmark = (
  options?: UseMutationOptions<DeleteBookmarkResponse, Error, string>
) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await bookmarks.deleteBookmark({ path: { id } });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from deleteBookmark");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("bookmarks");
    },
    ...options,
  });

export const useRestoreBookmark = (
  options?: UseMutationOptions<RestoreBookmarkResponse, Error, string>
) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await bookmarks.restoreBookmark({ path: { id } });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from restoreBookmark");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("bookmarks");
    },
    ...options,
  });
