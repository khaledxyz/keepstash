import type { Folder } from "@keepstash/ts-sdk";

import { create } from "zustand";

interface FolderDialogState {
  isOpen: boolean;
  mode: "create" | "edit";
  folder: Folder | null;
  openCreateDialog: () => void;
  openEditDialog: (folder: Folder) => void;
  closeDialog: () => void;
}

export const useFolderDialogStore = create<FolderDialogState>((set) => ({
  isOpen: false,
  mode: "create",
  folder: null,
  openCreateDialog: () => set({ isOpen: true, mode: "create", folder: null }),
  openEditDialog: (folder) => set({ isOpen: true, mode: "edit", folder }),
  closeDialog: () => set({ isOpen: false, folder: null }),
}));
