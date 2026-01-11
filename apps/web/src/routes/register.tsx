import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";

import { AuthCard } from "@/features/auth/components/auth-card";

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

const registerSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    const { email, password } = data;

    try {
      await authClient.signUp.email(
        {
          name: email.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            toast.success("Account created!", {
              description: `Welcome to ${env.appName}.`,
            });
          },
          onError: (ctx) => {
            form.setError("root", { message: ctx.error.message });
          },
        }
      );
    } catch {
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const rootError = form.formState.errors.root;

  return (
    <AuthCard title="Create account">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  aria-describedby={
                    fieldState.invalid ? "password-error" : undefined
                  }
                  aria-invalid={fieldState.invalid}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
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
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          className="text-foreground hover:underline"
          tabIndex={isLoading ? -1 : undefined}
          to="/login"
        >
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
