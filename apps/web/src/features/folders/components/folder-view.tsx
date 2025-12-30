import { Suspense, use } from "react";

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

import type { Folder } from "@/features/folders/api";

// import { FolderDialog } from "@/features/folders/components/folder-dialog";

import { FolderItem, FoldersSkeleton } from "./folder-item";

interface Props {
  foldersPromise: Promise<Folder[]>;
}

export function FoldersView({ foldersPromise }: Props) {
  return (
    <Suspense fallback={<FoldersSkeleton />}>
      <FoldersViewContent foldersPromise={foldersPromise} />
    </Suspense>
  );
}

function FoldersViewContent({ foldersPromise }: Props) {
  const folders = use(foldersPromise);

  if (!folders || folders.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>No folders yet</EmptyTitle>
        </EmptyHeader>

        <EmptyDescription>
          You haven’t created any folders yet. <br />
          Organize your bookmarks by creating one.
        </EmptyDescription>

        <EmptyContent>{/* <FolderDialog /> */}</EmptyContent>
      </Empty>
    );
  }

  return (
    <ItemGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {folders.map((folder) => (
        <FolderItem folder={folder} key={folder.id} />
      ))}
    </ItemGroup>
  );
}
