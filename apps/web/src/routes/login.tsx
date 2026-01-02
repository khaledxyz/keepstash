import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { EmailField } from "@/features/auth/components/email-field";
import { PasswordField } from "@/features/auth/components/password-field";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        form.setError("email", {
          message: result.error.message,
        });
        return;
      }

      // PublicOnlyLayout will handle redirect automatically
    } catch {
      form.setError("email", {
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard title="Welcome back">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <EmailField field={field} fieldState={fieldState} />
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordField field={field} fieldState={fieldState} />
            )}
          />
        </div>

        <div className="flex justify-end">
          <Link
            className="text-muted-foreground text-sm hover:text-foreground"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <p className="text-center text-muted-foreground text-sm">
        Don't have an account?{" "}
        <Link className="text-foreground hover:underline" to="/register">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
