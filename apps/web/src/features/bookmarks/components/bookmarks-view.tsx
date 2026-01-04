import { useMemo } from "react";

import { EmptyIcon } from "@phosphor-icons/react";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  throttle,
  useQueryStates,
} from "nuqs";
import { useDebounceValue } from "usehooks-ts";

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
  const [filters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      folder: parseAsString.withDefault(""),
      sort: parseAsString.withDefault(""),
      tags: parseAsArrayOf(parseAsString).withDefault([]),
      dateFrom: parseAsIsoDateTime,
      dateTo: parseAsIsoDateTime,
    },
    {
      limitUrlUpdates: throttle(300),
    }
  );

  // Debounce the search filter to prevent rapid API calls while typing
  const [debouncedSearch] = useDebounceValue(filters.search, 300);

  // Build query params, filtering out empty values
  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(filters.folder && { folder: filters.folder }),
      ...(filters.sort && {
        sort: filters.sort as "Most Recent" | "Oldest First" | "Alphabetical",
      }),
      ...(filters.tags.length > 0 && { tags: filters.tags }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom.toISOString() }),
      ...(filters.dateTo && { dateTo: filters.dateTo.toISOString() }),
    }),
    [
      debouncedSearch,
      filters.folder,
      filters.sort,
      filters.tags,
      filters.dateFrom,
      filters.dateTo,
    ]
  );

  const { data, isLoading } = useFindUserBookmarks(queryParams);
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
