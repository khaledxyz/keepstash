import {
  CalendarIcon,
  DotsThreeVerticalIcon,
  FolderIcon,
} from "@phosphor-icons/react";

import { BookmarkActionsDropdown } from "@/components/bookmark-actions-dropdown";
import { Badge } from "@/components/ui/badge";
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

import { timeAgo } from "@/lib/utils";

const bookmark = {
  title: "This is a research about biological science",
  url: "https://example.com/research/biological-science",
  folder: "Research Papers",
  tags: ["Biology", "Science", "Research"],
  dateAdded: "2025-12-26",
  favicon: "https://github.com/khaledxyz.png",
};

export function BookmarkItem() {
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
          <div className="flex items-center gap-1">
            {bookmark.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <Separator className="mx-2" orientation="vertical" />
          <div className="flex items-center gap-1">
            <FolderIcon />
            <span>{bookmark.folder}</span>
          </div>
          <Separator className="mx-2" orientation="vertical" />
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span>{timeAgo(bookmark.dateAdded)}</span>
          </div>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <BookmarkActionsDropdown />
      </ItemActions>
    </Item>
  );
}

export function BookmarkItemSkeleton() {
  return (
    <Item role="listitem" variant="outline">
      <ItemMedia variant="image">
        <Skeleton className="size-8" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <Skeleton className="h-5 w-sm" />
        </ItemTitle>
        <ItemDescription className="flex items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
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
