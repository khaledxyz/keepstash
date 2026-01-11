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

import { useCreateTag, useUpdateTag } from "../api";
import { useTagDialogStore } from "../store/tag-dialog-store";

const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required.")
    .max(50, "Tag name must be at most 50 characters."),
});

type TagFormData = z.infer<typeof tagSchema>;

export function TagDialog() {
  const { isOpen, mode, tag, closeDialog } = useTagDialogStore();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen && tag) {
      form.reset({
        name: tag.name,
      });
    } else if (isOpen) {
      form.reset({
        name: "",
      });
    }
  }, [isOpen, tag, form]);

  async function onSubmit(data: TagFormData) {
    const { name } = data;

    if (mode === "edit" && tag) {
      await updateTag.mutateAsync({
        id: tag.id,
        data: {
          name,
        },
      });
      toast.success(`Updated tag ${name}`);
    }

    if (mode === "create") {
      await createTag.mutateAsync({
        name,
      });

      toast.success(`Created tag ${name}`);
    }

    closeDialog();
    form.reset();
  }

  const isPending = createTag.isPending || updateTag.isPending;

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
            {mode === "edit" ? "Edit Tag" : "Create Tag"}
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

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

            <ResponsiveModalFooter>
              <Button
                disabled={isPending}
                form="tag-form"
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
