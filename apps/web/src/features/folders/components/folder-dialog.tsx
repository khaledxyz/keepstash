import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon weight="bold" />
          <span>Folders</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>

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
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            disabled={createFolder.isPending}
            form="folder-form"
            type="submit"
          >
            {createFolder.isPending ? <Spinner /> : null}
            <span>{createFolder.isPending ? "Creating..." : "Create"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
