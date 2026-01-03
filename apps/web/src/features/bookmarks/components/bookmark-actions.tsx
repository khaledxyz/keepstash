import type { Bookmark } from "@keepstash/ts-sdk";

import {
  DotsThreeVerticalIcon,
  InfoIcon,
  PencilIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import { sleep } from "@/lib/utils";

import { usePrompt } from "@/hooks/use-prompt";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useBookmarkSheet } from "../store/bookmark-sheet-store";

export function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
  const { open } = useBookmarkSheet();
  const prompt = usePrompt();

  async function handleDeleteBookmark() {
    await prompt({
      title: "Delete Bookmark",
      description: "This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete Bookmark",
      processingText: "Deleting",
      onConfirm: async () => {
        await sleep();
        // TODO: Delete bookmark mutation
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
