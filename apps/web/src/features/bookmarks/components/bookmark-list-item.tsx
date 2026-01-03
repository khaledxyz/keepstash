import type { Bookmark } from "@keepstash/ts-sdk";

import { DotsThreeVerticalIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { BookmarkActions } from "./bookmark-actions";
import { BookmarkMetadata } from "./shared/bookmark-metadata";

export function BookmarkListItem({ bookmark }: { bookmark: Bookmark }) {
  const domain = new URL(bookmark.url).hostname;
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <Item role="listitem" variant="outline">
      <ItemMedia variant="image">
        <img
          alt=""
          className="object-cover"
          height={32}
          src={favicon}
          width={32}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{bookmark.title}</ItemTitle>
        <ItemDescription className="flex items-center gap-2">
          <span className="truncate text-muted-foreground text-xs">
            {bookmark.url}
          </span>
          <Separator orientation="vertical" />
          <BookmarkMetadata createdAt={bookmark.createdAt} />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <BookmarkActions bookmark={bookmark} />
      </ItemActions>
    </Item>
  );
}

export function BookmarkListItemSkeleton() {
  return (
    <Item role="listitem" variant="outline">
      <ItemMedia variant="image">
        <Skeleton className="size-8" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <Skeleton className="h-4 w-sm" />
        </ItemTitle>
        <ItemDescription className="flex items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button disabled size="icon" variant="outline">
          <DotsThreeVerticalIcon className="opacity-30" />
        </Button>
      </ItemActions>
    </Item>
  );
}
