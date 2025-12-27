import { Activity, Suspense, use, useState } from "react";

import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react";

import { BookmarkCard, BookmarkCardSkeleton } from "@/components/bookmark-card";
import { BookmarkItem, BookmarkItemSkeleton } from "@/components/bookmark-item";
import { FiltersToolbar } from "@/components/filters";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

import { fetchBookmarks } from "@/data/bookmarks";

const bookmarksPromise = fetchBookmarks();

function BookmarkList() {
  const bookmarks = use(bookmarksPromise);

  return (
    <div className="space-y-2">
      {bookmarks.map((bookmark) => (
        <BookmarkItem bookmark={bookmark} key={bookmark.id} />
      ))}
    </div>
  );
}

function BookmarkGrid() {
  const bookmarks = use(bookmarksPromise);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard bookmark={bookmark} key={bookmark.id} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <>
      <Navbar />
      <main className="container">
        <FiltersToolbar />
        <div className="mt-4 flex items-center justify-end gap-1">
          <Button
            onClick={() => setView("list")}
            size="icon"
            variant={view === "list" ? "default" : "outline"}
          >
            <ListIcon />
          </Button>
          <Button
            onClick={() => setView("grid")}
            size="icon"
            variant={view === "grid" ? "default" : "outline"}
          >
            <SquaresFourIcon />
          </Button>
        </div>
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <BookmarkItemSkeleton key={i} />
                ))}
              </div>
            }
          >
            <Activity mode={view === "list" ? "visible" : "hidden"}>
              <BookmarkList />
            </Activity>
          </Suspense>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BookmarkCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <Activity mode={view === "grid" ? "visible" : "hidden"}>
              <BookmarkGrid />
            </Activity>
          </Suspense>
        </div>
      </main>
    </>
  );
}
