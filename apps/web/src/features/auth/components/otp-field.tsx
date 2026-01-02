import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpFieldProps {
  // biome-ignore lint/suspicious/noExplicitAny: <TODO: Check later>
  field: ControllerRenderProps<any, "otp">;
  fieldState: ControllerFieldState;
  id?: string;
}

export function OtpField({ field, fieldState, id = "otp" }: OtpFieldProps) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>Verification Code</FieldLabel>
      <InputOTP
        id={id}
        maxLength={6}
        onChange={field.onChange}
        pattern={REGEXP_ONLY_DIGITS}
        value={field.value}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
