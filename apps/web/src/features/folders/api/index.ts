import type {
  CreateFolder,
  CreateFolderResponse,
  DeleteFolderResponse,
  FindUserFoldersData,
  FindUserFoldersResponse,
  RestoreFolderResponse,
} from "@keepstash/ts-sdk";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { folders } from "@keepstash/ts-sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

import { invalidateByPrefix } from "@/lib/query-client";
import { queryKeysFactory } from "@/lib/query-key-factory";

export const foldersQueryKeys = queryKeysFactory("folders");

type FindUserFoldersParams = NonNullable<FindUserFoldersData["query"]>;

export const useFindUserFolders = (
  params?: FindUserFoldersParams,
  options?: Omit<
    UseQueryOptions<FindUserFoldersResponse, Error>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery({
    queryKey: foldersQueryKeys.list(params ?? {}),
    queryFn: async () => {
      const result = await folders.findUserFolders({
        query: params,
      });
      if (result.error) {
        throw result.error;
      }
      if (result.data === undefined) {
        throw new Error("No data returned from findUserFolders");
      }
      return result.data;
    },
    ...options,
  });

export const useCreateFolder = (
  options?: UseMutationOptions<CreateFolderResponse, Error, CreateFolder>
) =>
  useMutation({
    mutationFn: async (payload: CreateFolder) => {
      const result = await folders.createFolder({ body: payload });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from createFolder");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("folders");
    },
    ...options,
  });

export const useDeleteFolder = (
  options?: UseMutationOptions<DeleteFolderResponse, Error, string>
) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await folders.deleteFolder({ path: { id } });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from deleteFolder");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("folders");
    },
    ...options,
  });

export const useRestoreFolder = (
  options?: UseMutationOptions<RestoreFolderResponse, Error, string>
) =>
  useMutation({
    mutationFn: async (id: string) => {
      const result = await folders.restoreFolder({ path: { id } });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from restoreFolder");
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateByPrefix("folders");
    },
    ...options,
  });
