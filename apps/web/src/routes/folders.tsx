import { FolderDialog } from "@/features/folders/components/folder-dialog";
import { FoldersView } from "@/features/folders/components/folder-view";

export function FoldersPage() {
  return (
    <div className="container">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="font-bold text-3xl">Create Folder</h1>
          <p className="text-muted-foreground">Manage your folders</p>
        </div>
        <FolderDialog />
      </div>

      <FoldersView />
    </div>
  );
}
