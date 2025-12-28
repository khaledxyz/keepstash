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

import type { Bookmark } from "../api";
import { BookmarkActions } from "./bookmark-actions";
import { BookmarkMetadata } from "./shared/bookmark-metadata";
import { BookmarkTags } from "./shared/bookmark-tags";

export function BookmarkListItem({ bookmark }: { bookmark: Bookmark }) {
  return (
    <Item role="listitem" variant="outline">
      <ItemMedia variant="image">
        <img
          alt=""
          className="object-cover grayscale"
          height={32}
          src="https://github.com/khaledxyz.png"
          width={32}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{bookmark.title}</ItemTitle>
        <ItemDescription className="flex items-center">
          <BookmarkTags tags={bookmark.tags} />
          <Separator className="mx-2" orientation="vertical" />
          <BookmarkMetadata
            dateAdded={bookmark.dateAdded}
            folder={bookmark.folder}
            showSeparator={false}
          />
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
