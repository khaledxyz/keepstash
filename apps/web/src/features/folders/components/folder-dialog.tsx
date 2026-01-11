import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Spinner } from "@/components/ui/spinner";

import { useCreateFolder, useUpdateFolder } from "../api";
import { useFolderDialogStore } from "../store/folder-dialog-store";

const folderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required.")
    .max(100, "Folder name must be at most 100 characters."),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters.")
    .optional(),
});

type FolderFormData = z.infer<typeof folderSchema>;

export function FolderDialog() {
  const { isOpen, mode, folder, closeDialog } = useFolderDialogStore();
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();

  const form = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen && folder) {
      form.reset({
        name: folder.name,
        description: folder.description ?? "",
      });
    } else if (isOpen) {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [isOpen, folder, form]);

  async function onSubmit(data: FolderFormData) {
    const { name, description } = data;

    if (mode === "edit" && folder) {
      await updateFolder.mutateAsync({
        id: folder.id,
        data: {
          name,
          description,
        },
      });

      toast.success(`Updated folder ${name}`, {
        description,
      });
    }

    if (mode === "create") {
      await createFolder.mutateAsync({
        name,
        description,
      });

      toast.success(`Created folder ${name}`, {
        description,
      });
    }

    closeDialog();
    form.reset();
  }

  const isPending = createFolder.isPending || updateFolder.isPending;

  const getButtonText = () => {
    if (isPending) {
      return mode === "edit" ? "Updating..." : "Creating...";
    }
    return mode === "edit" ? "Update" : "Create";
  };

  return (
    <ResponsiveModal onOpenChange={closeDialog} open={isOpen}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>
            {mode === "edit" ? "Edit Folder" : "Create Folder"}
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <form id="folder-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="folder-name">Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id="folder-name"
                    placeholder="Work projects"
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
                  <FieldLabel htmlFor="folder-description">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id="folder-description"
                    placeholder="Optional description"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <ResponsiveModalFooter>
              <Button
                disabled={isPending}
                form="folder-form"
                size="lg"
                type="submit"
              >
                {isPending ? <Spinner /> : null}
                <span>{getButtonText()}</span>
              </Button>
            </ResponsiveModalFooter>
          </FieldGroup>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
