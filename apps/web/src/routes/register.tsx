import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { EmailField } from "@/features/auth/components/email-field";
import { PasswordField } from "@/features/auth/components/password-field";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const registerSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: data.email,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        form.setError("email", {
          message: result.error.message,
        });
        return;
      }

      toast.success("Account created!", {
        description:
          "Welcome to Keepstash. You've been automatically logged in.",
      });

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
    <AuthCard title="Create account">
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

        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>

      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link className="text-foreground hover:underline" to="/login">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
