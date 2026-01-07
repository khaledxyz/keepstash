import { TagIcon } from "@phosphor-icons/react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";

import { useFindUserTags } from "../api";
import { TagDialog } from "./tag-dialog";
import { TagItem, TagsSkeleton } from "./tag-item";

export function TagsView() {
  const { data, isLoading, isError, error } = useFindUserTags();

  if (isLoading) {
    return <TagsSkeleton />;
  }

  if (isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TagIcon />
          </EmptyMedia>
          <EmptyTitle>Failed to load tags</EmptyTitle>
        </EmptyHeader>
        <EmptyDescription>
          {error?.message || "An error occurred while loading tags."}
        </EmptyDescription>
      </Empty>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TagIcon size={32} />
          </EmptyMedia>
          <EmptyTitle>No tags yet</EmptyTitle>
        </EmptyHeader>

        <EmptyDescription>
          You haven't created any tags yet. <br />
          Organize your bookmarks by creating one.
        </EmptyDescription>

        <EmptyContent>
          <TagDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ItemGroup className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {data.items.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
    </ItemGroup>
  );
}
