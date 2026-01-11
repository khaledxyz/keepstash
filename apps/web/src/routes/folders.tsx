import { PlusIcon } from "@phosphor-icons/react";

import { FolderDialog } from "@/features/folders/components/folder-dialog";
import { FoldersView } from "@/features/folders/components/folder-view";
import { useFolderDialogStore } from "@/features/folders/store/folder-dialog-store";

import { MobileFAB } from "@/components/mobile-fab";
import { Button } from "@/components/ui/button";

export default function FoldersPage() {
  const { openCreateDialog } = useFolderDialogStore();

  return (
    <div className="container">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="font-bold text-3xl">Folders</h1>
          <p className="text-muted-foreground">Manage your folders</p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon weight="bold" />
          <span>Create Folder</span>
        </Button>
      </div>

      <FoldersView />
      <FolderDialog />
      <MobileFAB label="Create folder" onClick={openCreateDialog} />
    </div>
  );
}
