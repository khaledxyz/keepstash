import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { z } from "zod";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailStepProps {
  onSubmit: (email: string) => Promise<void>;
  initialEmail?: string;
}

export function EmailStep({ onSubmit, initialEmail = "" }: EmailStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  async function handleSubmit(data: EmailFormData) {
    setIsLoading(true);
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      await onSubmit(cleanEmail);
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

  const rootError = form.formState.errors.root;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <p className="text-muted-foreground text-sm">
          We'll send you a verification code to reset your password.
        </p>

        {rootError && (
          <Alert variant="destructive">
            <WarningCircleIcon />
            <AlertTitle>{rootError.message}</AlertTitle>
          </Alert>
        )}

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                aria-describedby={
                  fieldState.invalid ? "email-error" : undefined
                }
                aria-invalid={fieldState.invalid}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                id="email"
                inputMode="email"
                placeholder="user@keepstash.io"
                spellCheck="false"
                type="email"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} id="email-error" />
              )}
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? <Spinner /> : null}
            {isLoading ? "Sending..." : "Continue"}
          </Button>
        </Field>

        <p className="text-center text-muted-foreground text-sm">
          <Link
            className="text-foreground hover:underline"
            tabIndex={isLoading ? -1 : undefined}
            to="/login"
          >
            Back to login
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
