import { fetchTags } from "@/features/tags/api";
import { TagDialog } from "@/features/tags/components/tag-dialog";
import { TagsView } from "@/features/tags/components/tag-view";

export function TagsPage() {
  const tagsPromise = fetchTags();

  return (
    <div className="container">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="font-bold text-3xl">Create Tag</h1>
          <p className="text-muted-foreground">Manage your tags</p>
        </div>
        <TagDialog />
      </div>

      <TagsView tagsPromise={tagsPromise} />
    </div>
  );
}
