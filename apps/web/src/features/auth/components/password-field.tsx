import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import { useState } from "react";

import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface PasswordFieldProps {
  field: ControllerRenderProps<any, "password">;
  fieldState: ControllerFieldState;
  id?: string;
  label?: string;
}

export function PasswordField({
  field,
  fieldState,
  id = "password",
  label = "Password",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          {...field}
          aria-invalid={fieldState.invalid}
          autoComplete={id === "password" ? "current-password" : "new-password"}
          id={id}
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setShowPassword((v) => !v)}
            type="button"
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
