import type { Tag } from "@/features/tags/api";

import { Suspense, use } from "react";

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

import { TagItem, TagsSkeleton } from "./tag-item";

interface Props {
  tagsPromise: Promise<Tag[]>;
}

export function TagsView({ tagsPromise }: Props) {
  return (
    <Suspense fallback={<TagsSkeleton />}>
      <TagsViewContent tagsPromise={tagsPromise} />
    </Suspense>
  );
}

function TagsViewContent({ tagsPromise }: Props) {
  const tags = use(tagsPromise);

  if (!tags || tags.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TagIcon size={32} />
          </EmptyMedia>
          <EmptyTitle>No tags</EmptyTitle>
          <EmptyDescription>
            Add your first tag to organize your bookmarks.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    );
  }

  return (
    <ItemGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
    </ItemGroup>
  );
}
