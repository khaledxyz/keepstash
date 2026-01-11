import { GridFourIcon, ListIcon } from "@phosphor-icons/react";

import { BookmarkSheet } from "@/features/bookmarks/components/bookmark-sheet";
import { BookmarksView } from "@/features/bookmarks/components/bookmarks-view";
import { useBookmarkDialogStore } from "@/features/bookmarks/store/bookmark-dialog-store";
import { useViewMode } from "@/features/bookmarks/store/view-mode-store";
import { FiltersToolbar } from "@/features/filters/components/filters-toolbar";

import { MobileFAB } from "@/components/mobile-fab";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { viewMode, setViewMode } = useViewMode();
  const { openDialog } = useBookmarkDialogStore();

  return (
    <>
      <div className="container">
        <FiltersToolbar />
        <div className="my-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Bookmarks</h1>
            <p className="text-muted-foreground">Manage your saved links</p>
          </div>

          <div className="flex gap-1 rounded-md border p-1">
            <Button
              onClick={() => setViewMode("grid")}
              size="icon"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
            >
              <GridFourIcon />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              size="icon"
              variant={viewMode === "list" ? "secondary" : "ghost"}
            >
              <ListIcon />
            </Button>
          </div>
        </div>

        <BookmarksView viewMode={viewMode} />
      </div>

      <MobileFAB label="Create bookmark" onClick={openDialog} />
      <BookmarkSheet />
    </>
  );
}
