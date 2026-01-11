import type { Tag } from "@keepstash/ts-sdk";

import { create } from "zustand";

interface TagDialogState {
  isOpen: boolean;
  mode: "create" | "edit";
  tag: Tag | null;
  openCreateDialog: () => void;
  openEditDialog: (tag: Tag) => void;
  closeDialog: () => void;
}

export const useTagDialogStore = create<TagDialogState>((set) => ({
  isOpen: false,
  mode: "create",
  tag: null,
  openCreateDialog: () => set({ isOpen: true, mode: "create", tag: null }),
  openEditDialog: (tag) => set({ isOpen: true, mode: "edit", tag }),
  closeDialog: () => set({ isOpen: false, tag: null }),
}));
