import type { Bookmark } from "../api";

import { LinkIcon } from "@phosphor-icons/react";

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

import { BookmarkActions } from "./bookmark-actions";
import { BookmarkMetadata } from "./shared/bookmark-metadata";
import { BookmarkTags } from "./shared/bookmark-tags";

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
          <BookmarkActions bookmark={bookmark} />
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
        <BookmarkTags tags={bookmark.tags} />
        <Separator className="hidden sm:block" orientation="vertical" />
        <BookmarkMetadata
          dateAdded={bookmark.dateAdded}
          folder={bookmark.folder}
        />
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
