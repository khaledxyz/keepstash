import { EmptyIcon } from "@phosphor-icons/react";

import { useFindUserBookmarks } from "@/features/bookmarks/api";
import { BookmarkDialog } from "@/features/bookmarks/components/bookmark-dialog";
import {
  BookmarksGrid,
  BookmarksGridSkeleton,
} from "@/features/bookmarks/layouts/bookmarks-grid";
import {
  BookmarksList,
  BookmarksListSkeleton,
} from "@/features/bookmarks/layouts/bookmarks-list";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface Props {
  viewMode: "grid" | "list";
}

export function BookmarksView({ viewMode }: Props) {
  const { data, isLoading } = useFindUserBookmarks();
  const bookmarks = data?.items ?? [];

  if (isLoading) {
    return viewMode === "grid" ? (
      <BookmarksGridSkeleton />
    ) : (
      <BookmarksListSkeleton />
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <EmptyIcon />
          </EmptyMedia>
          <EmptyTitle>No bookmarks yet</EmptyTitle>
        </EmptyHeader>
        <EmptyDescription>
          You haven't added any bookmarks. <br />
          Start saving your favorite links to see them here.
        </EmptyDescription>

        <EmptyContent>
          <BookmarkDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return viewMode === "grid" ? (
    <BookmarksGrid bookmarks={bookmarks} />
  ) : (
    <BookmarksList bookmarks={bookmarks} />
  );
}
