import { BookmarkDialog } from "@/features/bookmarks/components/bookmark-dialog";
import { FolderDialog } from "@/features/folders/components/folder-dialog";
import { TagDialog } from "@/features/tags/components/tag-dialog";

export function Modals() {
  return (
    <>
      <BookmarkDialog />
      <FolderDialog />
      <TagDialog />
    </>
  );
}
