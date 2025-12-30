import type { Tag } from "../api";

import { PencilIcon, TrashIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export function TagItem({ tag }: { tag: Tag }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{tag.name}</ItemTitle>
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

export function TagsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <not needed>
        <Item key={i} variant="outline">
          <ItemContent>
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
