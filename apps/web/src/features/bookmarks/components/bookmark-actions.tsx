import type { Bookmark } from "@keepstash/ts-sdk";

import {
  DotsThreeVerticalIcon,
  InfoIcon,
  PencilIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { usePrompt } from "@/hooks/use-prompt";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteBookmark, useRestoreBookmark } from "../api";
import { useBookmarkSheet } from "../store/bookmark-sheet-store";

export function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
  const { mutateAsync: deleteBookmark } = useDeleteBookmark();
  const { mutateAsync: restoreBookmark } = useRestoreBookmark();
  const { open } = useBookmarkSheet();

  const prompt = usePrompt();

  async function handleRestoreBookmark() {
    try {
      await restoreBookmark(bookmark.id);
      toast.success("Bookmark restored", {
        description: `"${bookmark.title}" has been restored successfully.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to restore bookmark", {
        description: message,
      });
    }
  }

  async function handleDeleteBookmark() {
    await prompt({
      title: "Delete bookmark",
      description: `Are you sure you want to delete "${bookmark.title}"? You can restore it later if needed.`,
      variant: "destructive",
      confirmText: "Delete",
      cancelText: "Cancel",
      processingText: "Deleting...",
      onConfirm: async () => {
        await deleteBookmark(bookmark.id);
        toast.success("Bookmark deleted", {
          description: `"${bookmark.title}" has been deleted successfully.`,
          action: {
            label: "Undo",
            onClick: handleRestoreBookmark,
          },
        });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error("Failed to delete bookmark", {
          description: message,
        });
      },
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="shadow-md" size="icon" variant="secondary">
          <DotsThreeVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem onClick={() => open(bookmark, "view")}>
          <InfoIcon />
          <span>Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(bookmark, "edit")}>
          <PencilIcon />
          <span>Edit Link</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteBookmark} variant="destructive">
          <TrashIcon />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
