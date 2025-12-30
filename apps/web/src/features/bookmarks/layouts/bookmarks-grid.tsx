import type { Bookmark } from "../api";

import {
  BookmarkCard,
  BookmarkCardSkeleton,
} from "../components/bookmark-card";

export function BookmarksGrid({ bookmarks }: { bookmarks: Bookmark[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard bookmark={bookmark} key={bookmark.id} />
      ))}
    </div>
  );
}

export function BookmarksGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <not needed>
        <BookmarkCardSkeleton key={i} />
      ))}
    </div>
  );
}
