import type { Bookmark } from "@keepstash/ts-sdk";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";

import { BookmarkActions } from "./bookmark-actions";
import { BookmarkMetadata } from "./shared/bookmark-metadata";

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const domain = new URL(bookmark.url).hostname;
  const thumbnail = `https://via.placeholder.com/430x240.png?text=${encodeURIComponent(domain)}`;

  return (
    <Card className="group overflow-hidden pt-0">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          alt=""
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          height={240}
          src={thumbnail}
          width={430}
        />
        <CardAction className="absolute top-4 right-4">
          <BookmarkActions bookmark={bookmark} />
        </CardAction>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{bookmark.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {bookmark.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <BookmarkMetadata
          createdAt={bookmark.createdAt}
          folder={bookmark.folder}
          link={bookmark.url}
          tags={bookmark.tags}
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
