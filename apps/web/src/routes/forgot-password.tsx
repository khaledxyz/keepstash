import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { EmailField } from "@/features/auth/components/email-field";
import { OtpField } from "@/features/auth/components/otp-field";
import { PasswordField } from "@/features/auth/components/password-field";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

const resetSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, "Verification code must be 6 digits."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

const STORAGE_KEY = "forgot-password-progress";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state - storedEmail is read once on mount
  const [step, setStep] = useState<"email" | "reset">(() => {
    const stored =
      searchParams.get("email") || localStorage.getItem(STORAGE_KEY);
    return stored ? "reset" : "email";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(() => {
    return searchParams.get("email") || localStorage.getItem(STORAGE_KEY) || "";
  });

  // Persist email and update URL on step change
  useEffect(() => {
    if (email && step === "reset") {
      localStorage.setItem(STORAGE_KEY, email);
      setSearchParams({ email }, { replace: true });
    } else if (step === "email") {
      localStorage.removeItem(STORAGE_KEY);
      setSearchParams({}, { replace: true });
    }
  }, [email, step, setSearchParams]);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: email || "",
      otp: "",
      password: "",
    },
  });

  // Sync form with persisted email on mount - only run once
  // biome-ignore lint/correctness/useExhaustiveDependencies: <only run on mount>
  useEffect(() => {
    if (email && step === "reset") {
      resetForm.setValue("email", email);
    }
  }, []);

  async function onEmailSubmit(data: EmailFormData) {
    setIsLoading(true);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "forget-password",
      });

      if (result.error) {
        emailForm.setError("email", {
          message: result.error.message ?? "Failed to send verification code.",
        });
        return;
      }

      // Success - move to reset step
      setEmail(data.email);
      resetForm.setValue("email", data.email);
      setStep("reset");
      toast.success("Verification code sent!", {
        description: "Check your email for the 6-digit code.",
      });
    } catch {
      emailForm.setError("email", {
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetSubmit(data: ResetFormData) {
    setIsLoading(true);
    try {
      const result = await authClient.emailOtp.resetPassword({
        email: data.email,
        otp: data.otp,
        password: data.password,
      });

      if (result.error) {
        const errorMessage =
          result.error.message ?? "Failed to reset password.";
        // Check if it's an OTP error
        if (
          errorMessage.toLowerCase().includes("code") ||
          errorMessage.toLowerCase().includes("otp")
        ) {
          resetForm.setError("otp", {
            message: errorMessage,
          });
        } else {
          resetForm.setError("password", {
            message: errorMessage,
          });
        }
        return;
      }

      // Success - auto login
      const loginResult = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (loginResult.error) {
        // Password reset succeeded but login failed
        toast.success("Password reset successful!", {
          description: "Please log in with your new password.",
        });
        navigate("/login");
        return;
      }

      // Full success
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Password reset successful!", {
        description: "You've been logged in automatically.",
      });

      // PublicOnlyLayout will handle redirect automatically
    } catch {
      resetForm.setError("password", {
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackToEmail() {
    setStep("email");
    setEmail("");
    resetForm.reset();
    localStorage.removeItem(STORAGE_KEY);
    setSearchParams({}, { replace: true });
  }

  return (
    <AuthCard
      title={step === "email" ? "Reset your password" : "Verify & reset"}
    >
      <CardContent>
        {step === "email" ? (
          <form
            id="email-form"
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          >
            <FieldGroup>
              <p className="text-muted-foreground text-sm">
                Enter your email address and we'll send you a verification code
                to reset your password.
              </p>
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field, fieldState }) => (
                  <EmailField field={field} fieldState={fieldState} />
                )}
              />
              <Field>
                <Button disabled={isLoading} form="email-form" type="submit">
                  {isLoading && <Spinner />}
                  <span>Send verification code</span>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <form
            id="reset-form"
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
          >
            <FieldGroup>
              <Alert>
                <CheckCircleIcon className="text-green-600" weight="fill" />
                <AlertDescription>
                  Verification code sent to{" "}
                  <span className="font-medium">{email}</span>
                </AlertDescription>
              </Alert>
              <Controller
                control={resetForm.control}
                name="otp"
                render={({ field, fieldState }) => (
                  <OtpField field={field} fieldState={fieldState} />
                )}
              />
              <Controller
                control={resetForm.control}
                name="password"
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    id="new-password"
                    label="New password"
                  />
                )}
              />
              <Field>
                <Button disabled={isLoading} form="reset-form" type="submit">
                  {isLoading && <Spinner />}
                  <span>Reset password</span>
                </Button>
              </Field>
              <Button onClick={handleBackToEmail} type="button" variant="ghost">
                <ArrowLeftIcon />
                <span>Back to email</span>
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="inline-flex justify-center">
        <p>
          Remember your password?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  );
}
