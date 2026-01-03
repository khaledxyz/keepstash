import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import z from "zod";

import { useCreateBookmark } from "@/features/bookmarks/api";
import { useFindUserFolders } from "@/features/folders/api";
import { useFindUserTags } from "@/features/tags/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z.string().optional(),
  folderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export function BookmarkDialog() {
  const [open, setOpen] = useState(false);

  const { data: foldersData, isLoading: foldersLoading } = useFindUserFolders();
  const { data: tagsData, isLoading: tagsLoading } = useFindUserTags();
  const createBookmark = useCreateBookmark();

  const folders = foldersData?.items ?? [];
  const availableTags = tagsData?.items ?? [];
  const hasFolders = folders.length > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      folderId: "",
      tagIds: [],
    },
  });

  const selectedTagIds = form.watch("tagIds") ?? [];

  const toggleTag = (tagId: string) => {
    const currentTags = form.getValues("tagIds") ?? [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId];
    form.setValue("tagIds", newTags);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createBookmark.mutateAsync({
        url: data.url,
        title: data.title,
        description: data.description || undefined,
        folderId: data.folderId || undefined,
        tagIds: data.tagIds && data.tagIds.length > 0 ? data.tagIds : undefined,
      });

      toast.success("Bookmark created successfully");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create bookmark");
      console.error("Failed to create bookmark:", error);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon weight="bold" />
          <span>New Bookmark</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form id="bookmark-form" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Bookmark</DialogTitle>
            <DialogDescription>
              Add a new bookmark to your collection. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* URL */}
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

            {/* Title */}
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

            {/* Description */}
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

            {/* Folder */}
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
                    <FieldLabel htmlFor="bookmark-folder">Folder</FieldLabel>
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
                              <SelectItem key={folder.id} value={folder.id}>
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

            {/* Tags */}
            <Field>
              <FieldLabel>Tags</FieldLabel>
              {tagsLoading && (
                <p className="text-muted-foreground text-sm">Loading tags...</p>
              )}
              {!tagsLoading && availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      className="cursor-pointer"
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      variant={
                        selectedTagIds.includes(tag.id) ? "default" : "outline"
                      }
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              {!tagsLoading && availableTags.length === 0 && (
                <div className="text-center text-muted-foreground text-sm">
                  <p className="mb-2">No tags yet</p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/tags">Create Tag</Link>
                  </Button>
                </div>
              )}
              <FieldDescription>
                Select tags to categorize your bookmark
              </FieldDescription>
            </Field>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={createBookmark.isPending || form.formState.isSubmitting}
              form="bookmark-form"
              type="submit"
            >
              {createBookmark.isPending ? "Creating..." : "Create Bookmark"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
