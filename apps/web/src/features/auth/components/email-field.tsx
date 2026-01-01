import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  field: ControllerRenderProps<any, "email">;
  fieldState: ControllerFieldState;
  id?: string;
}

export function EmailField({
  field,
  fieldState,
  id = "email",
}: EmailFieldProps) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>Email</FieldLabel>
      <Input
        {...field}
        aria-invalid={fieldState.invalid}
        autoComplete="email"
        id={id}
        placeholder="user@keepstash.io"
        type="email"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
