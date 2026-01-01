import { FolderIcon } from "@phosphor-icons/react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";

import { useFindUserFolders } from "../api";
import { FolderDialog } from "./folder-dialog";
import { FolderItem, FoldersSkeleton } from "./folder-item";

export function FoldersView() {
  const { data, isLoading, isError, error } = useFindUserFolders();

  if (isLoading) {
    return <FoldersSkeleton />;
  }

  if (isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>Failed to load folders</EmptyTitle>
        </EmptyHeader>
        <EmptyDescription>
          {error?.message || "An error occurred while loading folders."}
        </EmptyDescription>
      </Empty>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>No folders yet</EmptyTitle>
        </EmptyHeader>

        <EmptyDescription>
          You haven't created any folders yet. <br />
          Organize your bookmarks by creating one.
        </EmptyDescription>

        <EmptyContent>
          <FolderDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ItemGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.items.map((folder) => (
        <FolderItem folder={folder} key={folder.id} />
      ))}
    </ItemGroup>
  );
}
