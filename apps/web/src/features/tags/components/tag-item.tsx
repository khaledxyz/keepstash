import type { Tag } from "@keepstash/ts-sdk";

import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { usePrompt } from "@/hooks/use-prompt";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import { useDeleteTag, useRestoreTag } from "../api";

export function TagItem({ tag }: { tag: Tag }) {
  const prompt = usePrompt();
  const { mutateAsync: deleteTag } = useDeleteTag();
  const { mutateAsync: restoreTag } = useRestoreTag();

  async function handleRestoreTag() {
    try {
      await restoreTag(tag.id);
      toast.success("Tag restored", {
        description: `${tag.name} has been restored successfully.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to restore tag", {
        description: message,
      });
    }
  }

  async function handleDeleteTag() {
    await prompt({
      title: "Delete tag",
      description: `Are you sure you want to delete "${tag.name}"? You can restore it later if needed.`,
      variant: "destructive",
      confirmText: "Delete",
      cancelText: "Cancel",
      processingText: "Deleting...",
      onConfirm: async () => {
        await deleteTag(tag.id);
        toast.success("Tag deleted", {
          description: `${tag.name} has been deleted successfully.`,
          action: {
            label: "Undo",
            onClick: handleRestoreTag,
          },
        });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error("Failed to delete tag", {
          description: message,
        });
      },
    });
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{tag.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button onClick={handleDeleteTag} size="icon" variant="destructive">
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
