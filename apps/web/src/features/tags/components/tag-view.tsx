import { PlusIcon, TagIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
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
import { useTagDialogStore } from "../store/tag-dialog-store";
import { TagItem, TagsSkeleton } from "./tag-item";

export function TagsView() {
  const { data, isLoading, isError, error } = useFindUserTags();
  const { openCreateDialog } = useTagDialogStore();

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
          <Button onClick={openCreateDialog}>
            <PlusIcon weight="bold" />
            <span>Create Tag</span>
          </Button>
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
