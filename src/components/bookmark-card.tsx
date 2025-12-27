import { CalendarIcon, FolderIcon, LinkIcon } from "@phosphor-icons/react";

import { BookmarkActionsDropdown } from "@/components/bookmark-actions-dropdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { timeAgo } from "@/lib/utils";

import type { Bookmark } from "@/data/bookmarks";

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <Card className="group overflow-hidden pt-0">
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          alt={bookmark.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          height={240}
          src={bookmark.thumbnail}
          width={430}
        />
        <CardAction className="absolute top-4 right-4">
          <BookmarkActionsDropdown />
        </CardAction>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{bookmark.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <LinkIcon className="shrink-0" />
          <span className="truncate">{bookmark.url}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {bookmark.tags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator className="hidden sm:block" orientation="vertical" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <FolderIcon />
            <span>{bookmark.folder}</span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span>{timeAgo(bookmark.dateAdded)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function BookmarkCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}
