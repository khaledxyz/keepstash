import type {
  CreateTag,
  CreateTagResponse,
  DeleteTagResponse,
  FindUserTagsData,
  FindUserTagsResponse,
  RestoreTagResponse,
  UpdateTag,
  UpdateTagResponse,
} from "@keepstash/ts-sdk";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { tags } from "@keepstash/ts-sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

import { invalidateByPrefix } from "@/lib/query-client";
import { queryKeysFactory } from "@/lib/query-key-factory";

export const tagsQueryKeys = queryKeysFactory("tags");

type FindUserTagsParams = NonNullable<FindUserTagsData["query"]>;

export const useFindUserTags = (
  params?: FindUserTagsParams,
  options?: Omit<
    UseQueryOptions<FindUserTagsResponse, Error>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery({
    queryKey: tagsQueryKeys.list(params ?? {}),
    queryFn: async () => {
      const result = await tags.findUserTags({
        query: params,
      });
      if (result.error) {
        throw result.error;
      }
      if (result.data === undefined) {
        throw new Error("No data returned from findUserTags");
      }
      return result.data;
    },
    ...options,
  });

export const useCreateTag = (
  options?: UseMutationOptions<CreateTagResponse, Error, CreateTag>
) =>
  useMutation({
    mutationFn: async (payload: CreateTag) => {
      const result = await tags.createTag({ body: payload });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from createTag");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("tags");
    },
    ...options,
  });

export const useUpdateTag = (
  options?: UseMutationOptions<
    UpdateTagResponse,
    Error,
    { id: string; data: UpdateTag }
  >
) =>
  useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTag }) => {
      const result = await tags.updateTag({ path: { id }, body: data });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from updateTag");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("tags");
    },
    ...options,
  });

export const useDeleteTag = (
  options?: UseMutationOptions<DeleteTagResponse, Error, string>
) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await tags.deleteTag({ path: { id } });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from deleteTag");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("tags");
    },
    ...options,
  });

export const useRestoreTag = (
  options?: UseMutationOptions<RestoreTagResponse, Error, string>
) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await tags.restoreTag({ path: { id } });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from restoreTag");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("tags");
    },
    ...options,
  });
