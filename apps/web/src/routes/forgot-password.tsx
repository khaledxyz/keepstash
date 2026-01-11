import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { EmailStep } from "@/features/auth/components/forgot-password/email-step";
import { ResetStep } from "@/features/auth/components/forgot-password/reset-step";

const STORAGE_KEY = "forgot-password-email";
const RESEND_COOLDOWN_KEY = "forgot-password-resend-cooldown";
const COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [step, setStep] = useState<"email" | "reset">(() => {
    const stored =
      searchParams.get("email") || localStorage.getItem(STORAGE_KEY);
    return stored ? "reset" : "email";
  });
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

  function startCooldown() {
    const cooldownEnd = Date.now() + COOLDOWN_SECONDS * 1000;
    localStorage.setItem(RESEND_COOLDOWN_KEY, cooldownEnd.toString());
  }

  async function handleEmailSubmit(emailValue: string) {
    const result = await authClient.emailOtp.sendVerificationOtp({
      email: emailValue,
      type: "forget-password",
    });

    if (result.error) {
      throw new Error(
        result.error.message ?? "Failed to send verification code."
      );
    }

    setEmail(emailValue);
    setStep("reset");
    startCooldown();
    toast.success("Verification code sent!", {
      description: "Check your email for the 6-digit code.",
    });
  }

  async function handleResendCode() {
    const result = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (result.error) {
      throw new Error(
        result.error.message ?? "Failed to resend verification code."
      );
    }

    startCooldown();
    toast.success("Code resent!", {
      description: "Check your email for a new 6-digit code.",
    });
  }

  async function handleResetSubmit(otp: string, password: string) {
    const result = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message ?? "Failed to reset password.");
    }

    // Auto login after successful reset
    const loginResult = await authClient.signIn.email({
      email,
      password,
    });

    // Clean up storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESEND_COOLDOWN_KEY);

    if (loginResult.error) {
      toast.success("Password reset successful!", {
        description: "Please log in with your new password.",
      });
      navigate("/login");
      return;
    }

    toast.success("Password reset successful!", {
      description: "You've been logged in automatically.",
    });
  }

  function handleBackToEmail() {
    setStep("email");
    setEmail("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESEND_COOLDOWN_KEY);
    setSearchParams({}, { replace: true });
  }

  return (
    <AuthCard title={step === "email" ? "Reset password" : "Enter code"}>
      {step === "email" ? (
        <EmailStep initialEmail={email} onSubmit={handleEmailSubmit} />
      ) : (
        <ResetStep
          cooldownKey={RESEND_COOLDOWN_KEY}
          email={email}
          onBack={handleBackToEmail}
          onResend={handleResendCode}
          onSubmit={handleResetSubmit}
        />
      )}
    </AuthCard>
  );
}
