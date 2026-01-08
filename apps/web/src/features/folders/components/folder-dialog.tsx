import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@phosphor-icons/react";
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
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Spinner } from "@/components/ui/spinner";

import { useCreateFolder } from "../api";

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
  const [open, setOpen] = useState(false);

  const createFolder = useCreateFolder();

  const form = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: FolderFormData) {
    const { name, description } = data;
    await createFolder.mutateAsync({
      name,
      description,
    });

    setOpen(false);
    form.reset();
    toast.success(`Created folder ${name}`, {
      description,
    });
  }

  return (
    <ResponsiveModal onOpenChange={setOpen} open={open}>
      <ResponsiveModalTrigger asChild>
        <Button>
          <PlusIcon weight="bold" />
          <span>Create Folder</span>
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Create Folder</ResponsiveModalTitle>
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
                disabled={createFolder.isPending}
                form="folder-form"
                size="lg"
                type="submit"
              >
                {createFolder.isPending ? <Spinner /> : null}
                <span>{createFolder.isPending ? "Creating..." : "Create"}</span>
              </Button>
            </ResponsiveModalFooter>
          </FieldGroup>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
