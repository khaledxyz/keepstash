import { useState } from "react";

import { GridFourIcon, ListIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { fetchBookmarks } from "@/features/bookmarks/api";
import { BookmarkSheet } from "@/features/bookmarks/components/bookmark-sheet";
import { BookmarksView } from "@/features/bookmarks/components/bookmarks-view";
import { FiltersToolbar } from "@/features/filters/components/filters-toolbar";

export default function DashboardPage() {
  const bookmarksPromise = fetchBookmarks();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <div className="container py-6">
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

        <BookmarksView
          bookmarksPromise={bookmarksPromise}
          viewMode={viewMode}
        />
      </div>

      <BookmarkSheet />
    </>
  );
}
