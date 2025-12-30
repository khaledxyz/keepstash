import type { Bookmark } from "../api";
import {
  BookmarkListItem,
  BookmarkListItemSkeleton,
} from "../components/bookmark-list-item";

export function BookmarksList({ bookmarks }: { bookmarks: Bookmark[] }) {
  return (
    <ol className="space-y-2">
      {bookmarks.map((bookmark) => (
        <BookmarkListItem bookmark={bookmark} key={bookmark.id} />
      ))}
    </ol>
  );
}

export function BookmarksListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <BookmarkListItemSkeleton key={i} />
      ))}
    </ul>
  );
}
