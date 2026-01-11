import { PlusIcon } from "@phosphor-icons/react";

import { TagDialog } from "@/features/tags/components/tag-dialog";
import { TagsView } from "@/features/tags/components/tag-view";
import { useTagDialogStore } from "@/features/tags/store/tag-dialog-store";

import { MobileFAB } from "@/components/mobile-fab";
import { Button } from "@/components/ui/button";

export default function TagsPage() {
  const { openCreateDialog } = useTagDialogStore();

  return (
    <div className="container">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="font-bold text-3xl">Tags</h1>
          <p className="text-muted-foreground">Manage your tags</p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon weight="bold" />
          <span>Create Tag</span>
        </Button>
      </div>

      <TagsView />
      <TagDialog />
      <MobileFAB label="Create tag" onClick={openCreateDialog} />
    </div>
  );
}
