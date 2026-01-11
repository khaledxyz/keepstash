import type { Folder } from "@keepstash/ts-sdk";

import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { usePrompt } from "@/hooks/use-prompt";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import { useDeleteFolder, useRestoreFolder } from "../api";
import { useFolderDialogStore } from "../store/folder-dialog-store";

export function FolderItem({ folder }: { folder: Folder }) {
  const prompt = usePrompt();
  const { mutateAsync: deleteFolder } = useDeleteFolder();
  const { mutateAsync: restoreFolder } = useRestoreFolder();
  const { openEditDialog } = useFolderDialogStore();

  async function handleRestoreFolder() {
    try {
      await restoreFolder(folder.id);
      toast.success("Folder restored", {
        description: `"${folder.name}" has been restored successfully.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to restore folder", {
        description: message,
      });
    }
  }

  async function handleDeleteFolder() {
    await prompt({
      title: "Delete folder?",
      description: `Are you sure you want to delete "${folder.name}"? You can restore it later if needed.`,
      variant: "destructive",
      confirmText: "Delete",
      cancelText: "Cancel",
      processingText: "Deleting...",
      onConfirm: async () => {
        await deleteFolder(folder.id);
        toast.success("Folder deleted", {
          description: `"${folder.name}" has been deleted successfully.`,
          action: {
            label: "Undo",
            onClick: handleRestoreFolder,
          },
        });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error("Failed to delete folder", {
          description: message,
        });
      },
    });
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{folder.name}</ItemTitle>
        <ItemDescription>{folder.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button onClick={handleDeleteFolder} size="icon" variant="destructive">
          <TrashIcon />
        </Button>
        <Button
          onClick={() => openEditDialog(folder)}
          size="icon"
          variant="outline"
        >
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
        // biome-ignore lint/suspicious/noArrayIndexKey: <not needed>
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
