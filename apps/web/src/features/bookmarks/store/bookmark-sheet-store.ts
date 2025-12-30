import type { Bookmark } from "../api";

import { create } from "zustand";

interface BookmarkSheetStore {
  bookmark: Bookmark | null;
  mode: "view" | "edit";
  isOpen: boolean;
  open: (bookmark: Bookmark, mode: "view" | "edit") => void;
  close: () => void;
  setMode: (mode: "view" | "edit") => void;
}

export const useBookmarkSheet = create<BookmarkSheetStore>((set) => ({
  bookmark: null,
  mode: "view",
  isOpen: false,
  open: (bookmark, mode) => set({ bookmark, mode, isOpen: true }),
  close: () => set({ bookmark: null, isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
