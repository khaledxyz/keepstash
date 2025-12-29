import { PencilIcon, TrashIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import type { Folder } from "../api";

export function FolderItem({ folder }: { folder: Folder }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          {folder.title} • {folder.linksCount} links
        </ItemTitle>
        <ItemDescription>{folder.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="icon" variant="destructive">
          <TrashIcon />
        </Button>
        <Button size="icon" variant="outline">
          <PencilIcon />
        </Button>
      </ItemActions>
    </Item>
  );
}

export function FoldersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Item key={i} variant="outline">
          <ItemContent>
            <Skeleton className="mb-2 h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </ItemContent>
          <ItemActions>
            <Skeleton className="size-4" />
            <Skeleton className="size-4" />
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
