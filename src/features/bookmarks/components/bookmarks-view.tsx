import { Suspense, use } from "react";

import { EmptyIcon } from "@phosphor-icons/react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import type { Bookmark } from "@/features/bookmarks/api";
import { BookmarkDialog } from "@/features/bookmarks/components/bookmark-dialog";
import {
  BookmarksGrid,
  BookmarksGridSkeleton,
} from "@/features/bookmarks/layouts/bookmarks-grid";
import {
  BookmarksList,
  BookmarksListSkeleton,
} from "@/features/bookmarks/layouts/bookmarks-list";

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
