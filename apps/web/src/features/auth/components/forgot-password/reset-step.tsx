import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const resetSchema = z.object({
  otp: z
    .string()
    .length(6, "Verification code must be 6 digits.")
    .regex(/^\d+$/, "Code must contain only numbers."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

type ResetFormData = z.infer<typeof resetSchema>;

interface ResetStepProps {
  email: string;
  onSubmit: (otp: string, password: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  cooldownKey: string;
}

export function ResetStep({
  email,
  onSubmit,
  onResend,
  onBack,
  cooldownKey,
}: ResetStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  // Check cooldown on mount and update every second
  // biome-ignore lint/correctness/useExhaustiveDependencies: <Should run only once>
  useEffect(() => {
    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  function checkCooldown() {
    const cooldownEnd = localStorage.getItem(cooldownKey);
    if (!cooldownEnd) {
      setCooldownSeconds(0);
      return;
    }

    const remaining = Math.max(
      0,
      Math.ceil((Number(cooldownEnd) - Date.now()) / 1000)
    );
    setCooldownSeconds(remaining);

    if (remaining === 0) {
      localStorage.removeItem(cooldownKey);
    }
  }

  async function handleSubmit(data: ResetFormData) {
    setIsLoading(true);
    try {
      await onSubmit(data.otp, data.password);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (cooldownSeconds > 0 || isResending) {
      return;
    }

    setIsResending(true);
    try {
      await onResend();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to resend code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  }

  function getResendButtonText() {
    if (isResending) {
      return "Resending...";
    }
    if (cooldownSeconds > 0) {
      return `Resend code in ${cooldownSeconds}s`;
    }
    return "Resend code";
  }

  const rootError = form.formState.errors.root;
  const isResendDisabled = cooldownSeconds > 0 || isResending || isLoading;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Alert variant="success">
          <CheckCircleIcon />
          <AlertDescription>
            Code sent to <strong>{email}</strong>
          </AlertDescription>
        </Alert>

        {rootError && (
          <Alert variant="destructive">
            <WarningCircleIcon />
            <AlertTitle>{rootError.message}</AlertTitle>
          </Alert>
        )}

        <Controller
          control={form.control}
          name="otp"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <Input
                {...field}
                aria-describedby={fieldState.invalid ? "otp-error" : undefined}
                aria-invalid={fieldState.invalid}
                autoCapitalize="none"
                autoComplete="one-time-code"
                autoCorrect="off"
                data-form-type="other"
                data-lpignore="true"
                disabled={isLoading || isResending}
                id="otp"
                inputMode="numeric"
                maxLength={6}
                name="otp"
                pattern="[0-9]*"
                placeholder="000000"
                spellCheck="false"
                type="text"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id="otp-error" />
              )}
            </Field>
          )}
        />

        <Button
          className="w-full"
          disabled={isResendDisabled}
          onClick={handleResend}
          type="button"
          variant="outline"
        >
          {isResending && <Spinner />}
          {getResendButtonText()}
        </Button>

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input
                {...field}
                aria-describedby={
                  fieldState.invalid ? "password-error" : undefined
                }
                aria-invalid={fieldState.invalid}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading || isResending}
                id="password"
                placeholder="••••••••"
                spellCheck="false"
                type="password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id="password-error" />
              )}
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? <Spinner /> : null}
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </Field>

        <Button
          className="w-full"
          disabled={isLoading || isResending}
          onClick={onBack}
          type="button"
          variant="ghost"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      </FieldGroup>
    </form>
  );
}
