import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useBookmarkSheet } from "../store/bookmark-sheet-store";

export function BookmarkSheet() {
  const { bookmark, mode, isOpen, close, setMode } = useBookmarkSheet();

  if (!bookmark) {
    return null;
  }

  return (
    <Sheet onOpenChange={(open) => !open && close()} open={isOpen}>
      <SheetContent>
        <SheetHeader />
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <Tabs
            className="mt-6"
            onValueChange={(v) => setMode(v as "edit" | "view")}
            value={mode}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="view">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input readOnly value={bookmark.title} />
              </Field>
              <Field>
                <FieldLabel>URL</FieldLabel>
                <Input readOnly value={bookmark.url} />
              </Field>
              <Field>
                <FieldLabel>Folder</FieldLabel>
                <Input readOnly value={bookmark.folder} />
              </Field>
              <Field>
                <FieldLabel>Tags</FieldLabel>
                <Input readOnly value={bookmark.tags.join(", ")} />
              </Field>
            </TabsContent>

            <TabsContent className="space-y-4" value="edit">
              <div>
                <h3 className="mb-2 font-medium text-sm">Edit Bookmark</h3>
                <p className="text-muted-foreground text-sm">
                  Edit bookmark information
                </p>
              </div>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input defaultValue={bookmark.title} />
              </Field>
              <Field>
                <FieldLabel>URL</FieldLabel>
                <Input defaultValue={bookmark.url} />
              </Field>
              <Field>
                <FieldLabel>Folder</FieldLabel>
                <Input defaultValue={bookmark.folder} />
              </Field>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
