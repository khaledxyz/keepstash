import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { metadata } from "@keepstash/ts-sdk";
import { PlusIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import z from "zod";

import { useCreateBookmark } from "@/features/bookmarks/api";
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
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
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

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function BookmarkDialog({
  open: controlledOpen,
  onOpenChange,
  showTrigger = false,
}: Props = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const handleClose = () => {
    form.reset();
    handleOpenChange(false);
  };

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

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
  const urlValue = form.watch("url");
  const [debouncedUrl] = useDebounceValue(urlValue, 800);

  // Fetch metadata when debounced URL changes
  useEffect(() => {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <handle later>
    const fetchMetadata = async () => {
      // Skip if URL is empty or invalid
      if (!debouncedUrl) {
        return;
      }

      try {
        new URL(debouncedUrl); // Validate URL format
      } catch {
        return; // Invalid URL, skip fetching
      }

      // Only fetch if title is empty (don't override user-entered data)
      const currentTitle = form.getValues("title");
      if (currentTitle) {
        return;
      }

      setIsFetchingMetadata(true);

      try {
        const result = await metadata.getUrlMetadata({
          query: { url: debouncedUrl },
        });

        if (result.error) {
          console.error("Failed to fetch metadata:", result.error);
          return;
        }

        if (result.data) {
          // Only set title if it's still empty (user might have typed something)
          if (!form.getValues("title") && result.data.title) {
            form.setValue("title", result.data.title);
          }

          // Only set description if it's still empty
          if (!form.getValues("description") && result.data.description) {
            form.setValue("description", result.data.description);
          }
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setIsFetchingMetadata(false);
      }
    };

    fetchMetadata();
  }, [debouncedUrl, form]);

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
      handleOpenChange(false);
    } catch (error) {
      toast.error("Failed to create bookmark");
      console.error("Failed to create bookmark:", error);
    }
  };

  return (
    <ResponsiveModal onOpenChange={handleOpenChange} open={open}>
      {showTrigger && (
        <ResponsiveModalTrigger asChild>
          <Button>
            <PlusIcon weight="bold" />
            <span>New Bookmark</span>
          </Button>
        </ResponsiveModalTrigger>
      )}
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Create Bookmark</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Add a new bookmark to your collection. Fill in the details below.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <form id="bookmark-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
                  {isFetchingMetadata && (
                    <FieldDescription>
                      Fetching page metadata...
                    </FieldDescription>
                  )}
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
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bookmark-folder">Folder</FieldLabel>
                  {foldersLoading && (
                    <div className="flex items-center justify-between rounded-sm border border-dashed p-2">
                      <p>Loading folders...</p>
                    </div>
                  )}
                  {!(foldersLoading || hasFolders) && (
                    <div className="flex items-center justify-between rounded-sm border border-dashed p-2">
                      <p>No folders yet</p>
                      <Button
                        asChild
                        onClick={handleClose}
                        size="sm"
                        variant="outline"
                      >
                        <Link to="/dashboard/folders">Create Folder</Link>
                      </Button>
                    </div>
                  )}
                  {!foldersLoading && hasFolders && (
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        id="bookmark-folder"
                      >
                        <SelectValue placeholder="Select folder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Folders</SelectLabel>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Tags */}
            <Field>
              <FieldLabel>Tags</FieldLabel>
              {tagsLoading && (
                <div className="flex items-center justify-between rounded-sm border border-dashed p-2">
                  <p>Loading tags...</p>
                </div>
              )}
              {!tagsLoading && availableTags.length === 0 && (
                <div className="flex items-center justify-between rounded-sm border border-dashed p-2">
                  <p>No tags yet</p>
                  <Button
                    asChild
                    onClick={handleClose}
                    size="sm"
                    variant="outline"
                  >
                    <Link to="/dashboard/tags">Create Tag</Link>
                  </Button>
                </div>
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
            </Field>

            <ResponsiveModalFooter>
              <Button
                onClick={handleClose}
                size="lg"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  createBookmark.isPending || form.formState.isSubmitting
                }
                form="bookmark-form"
                size="lg"
                type="submit"
              >
                {createBookmark.isPending ? "Creating..." : "Create Bookmark"}
              </Button>
            </ResponsiveModalFooter>
          </FieldGroup>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
