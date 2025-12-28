import { Suspense, use } from "react";

import type { Bookmark } from "../api";
import {
  BookmarksGrid,
  BookmarksGridSkeleton,
} from "../layouts/bookmarks-grid";
import {
  BookmarksList,
  BookmarksListSkeleton,
} from "../layouts/bookmarks-list";

interface Props {
  bookmarksPromise: Promise<Bookmark[]>;
  viewMode: "grid" | "list";
}

export function BookmarksView({ bookmarksPromise, viewMode }: Props) {
  const Skeleton =
    viewMode === "grid" ? BookmarksGridSkeleton : BookmarksListSkeleton;

  return (
    <Suspense fallback={<Skeleton />}>
      <BookmarksViewContent
        bookmarksPromise={bookmarksPromise}
        viewMode={viewMode}
      />
    </Suspense>
  );
}

function BookmarksViewContent({ bookmarksPromise, viewMode }: Props) {
  const bookmarks = use(bookmarksPromise);

  return viewMode === "grid" ? (
    <BookmarksGrid bookmarks={bookmarks} />
  ) : (
    <BookmarksList bookmarks={bookmarks} />
  );
}
