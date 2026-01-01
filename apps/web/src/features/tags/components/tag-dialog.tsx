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

import { useCreateTag } from "../api";

const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required.")
    .max(50, "Tag name must be at most 50 characters."),
});

type TagFormData = z.infer<typeof tagSchema>;

export function TagDialog() {
  const [open, setOpen] = useState(false);

  const createTag = useCreateTag();

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: TagFormData) {
    const { name } = data;
    await createTag.mutateAsync({
      name,
    });

    setOpen(false);
    form.reset();
    toast.success(`Created tag ${name}`);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon weight="bold" />
          <span>Create Tag</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>

        <form id="tag-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tag-name">Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id="tag-name"
                    placeholder="JavaScript"
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
          <Button disabled={createTag.isPending} form="tag-form" type="submit">
            {createTag.isPending ? <Spinner /> : null}
            <span>Create</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
