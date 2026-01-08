import type { UpdateBookmark } from "@keepstash/ts-sdk";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { useFindUserFolders } from "@/features/folders/api";
import { useFindUserTags } from "@/features/tags/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ResponsiveSheet,
  ResponsiveSheetContent,
  ResponsiveSheetFooter,
  ResponsiveSheetHeader,
  ResponsiveSheetTitle,
} from "@/components/ui/responsive-sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateBookmark } from "../api";
import { useBookmarkSheet } from "../store/bookmark-sheet-store";

const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  folderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

type BookmarkFormData = z.infer<typeof bookmarkSchema>;

export function BookmarkSheet() {
  const { bookmark, mode, isOpen, close, setMode } = useBookmarkSheet();
  const { data: foldersData, isLoading: foldersLoading } = useFindUserFolders();
  const { data: tagsData, isLoading: tagsLoading } = useFindUserTags();
  const updateBookmark = useUpdateBookmark();

  const folders = foldersData?.items ?? [];
  const availableTags = tagsData?.items ?? [];
  const hasFolders = folders.length > 0;

  const form = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      folderId: "",
      tagIds: [],
    },
  });

  const selectedTagIds = form.watch("tagIds") ?? [];
  const isEditMode = mode === "edit";

  // Reset form when bookmark changes
  useEffect(() => {
    if (bookmark) {
      form.reset({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description ?? "",
        folderId: bookmark.folder?.id ?? "",
        tagIds: bookmark.tags?.map((tag) => tag.id) ?? [],
      });
    }
  }, [bookmark, form]);

  if (!bookmark) {
    return null;
  }

  const toggleTag = (tagId: string) => {
    const currentTags = form.getValues("tagIds") ?? [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId];
    form.setValue("tagIds", newTags);
  };

  const onSubmit = async (data: BookmarkFormData) => {
    try {
      const payload: UpdateBookmark = {
        title: data.title,
        url: data.url,
        description: data.description || undefined,
        folderId: data.folderId || undefined,
        tagIds: data.tagIds && data.tagIds.length > 0 ? data.tagIds : undefined,
      };

      await updateBookmark.mutateAsync({
        id: bookmark.id,
        payload,
      });

      toast.success("Bookmark updated successfully");
      close();
    } catch (error) {
      toast.error("Failed to update bookmark");
      console.error("Failed to update bookmark:", error);
    }
  };

  return (
    <ResponsiveSheet onOpenChange={(open) => !open && close()} open={isOpen}>
      <ResponsiveSheetContent>
        <ResponsiveSheetHeader>
          <ResponsiveSheetTitle>Bookmark Details</ResponsiveSheetTitle>
        </ResponsiveSheetHeader>

        <form
          className="flex h-full flex-col"
          id="bookmark-sheet-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-4">
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
                <FieldGroup>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input disabled readOnly value={bookmark.title} />
                  </Field>

                  <Field>
                    <FieldLabel>URL</FieldLabel>
                    <Input disabled readOnly value={bookmark.url} />
                  </Field>

                  {bookmark.description && (
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <Textarea
                        disabled
                        readOnly
                        rows={3}
                        value={bookmark.description}
                      />
                    </Field>
                  )}

                  <Field>
                    <FieldLabel>Folder</FieldLabel>
                    <Input
                      disabled
                      readOnly
                      value={bookmark.folder?.name ?? "No folder"}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Tags</FieldLabel>
                    {bookmark.tags && bookmark.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {bookmark.tags.map((tag) => (
                          <Badge key={tag.id}>{tag.name}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No tags</p>
                    )}
                  </Field>
                </FieldGroup>
              </TabsContent>

              <TabsContent className="space-y-4" value="edit">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="bookmark-title">Title</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          id="bookmark-title"
                          placeholder="Bookmark title"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="url"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="bookmark-url">URL</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          id="bookmark-url"
                          placeholder="https://example.com"
                          type="url"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="bookmark-description">
                          Description
                        </FieldLabel>
                        <Textarea
                          {...field}
                          aria-invalid={fieldState.invalid}
                          id="bookmark-description"
                          placeholder="Add a description..."
                          rows={3}
                        />
                        <FieldDescription>
                          Optional description for your bookmark
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="folderId"
                    render={({ field, fieldState }) => {
                      let placeholder = "Select folder";
                      if (foldersLoading) {
                        placeholder = "Loading folders...";
                      } else if (!hasFolders) {
                        placeholder = "No folders available";
                      }

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="bookmark-folder">
                            Folder
                          </FieldLabel>
                          <Select
                            disabled={foldersLoading || !hasFolders}
                            name={field.name}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              aria-invalid={fieldState.invalid}
                              id="bookmark-folder"
                            >
                              <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Folders</SelectLabel>
                                {hasFolders ? (
                                  folders.map((folder) => (
                                    <SelectItem
                                      key={folder.id}
                                      value={folder.id}
                                    >
                                      {folder.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center text-muted-foreground text-sm">
                                    <p className="mb-2">No folders yet</p>
                                    <Button asChild size="sm" variant="outline">
                                      <Link to="/folders">Create Folder</Link>
                                    </Button>
                                  </div>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FieldDescription>
                            Optional folder to organize your bookmark
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <Field>
                    <FieldLabel>Tags</FieldLabel>
                    {tagsLoading && (
                      <p className="text-muted-foreground text-sm">
                        Loading tags...
                      </p>
                    )}
                    {!tagsLoading && availableTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <Badge
                            className="cursor-pointer"
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            variant={
                              selectedTagIds.includes(tag.id)
                                ? "default"
                                : "outline"
                            }
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {!tagsLoading && availableTags.length === 0 && (
                      <div className="flex items-center justify-between rounded-sm border border-dashed p-2">
                        <p>No tags yet</p>
                        <Button asChild size="sm" variant="outline">
                          <Link to="tags">Create Tag</Link>
                        </Button>
                      </div>
                    )}
                    <FieldDescription>
                      Select tags to categorize your bookmark
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </TabsContent>
            </Tabs>
          </div>

          {isEditMode && (
            <ResponsiveSheetFooter className="px-4 py-4">
              <Button
                onClick={() => {
                  form.reset();
                  setMode("view");
                }}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  updateBookmark.isPending || form.formState.isSubmitting
                }
                form="bookmark-sheet-form"
                type="submit"
              >
                {updateBookmark.isPending ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </ResponsiveSheetFooter>
          )}
        </form>
      </ResponsiveSheetContent>
    </ResponsiveSheet>
  );
}
