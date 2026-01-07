import { useEffect, useState } from "react";

import { CheckIcon, EnvelopeIcon, XIcon } from "@phosphor-icons/react";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  email: string;
}

const BANNER_COOLDOWN_HOURS = 24;
const SUCCESS_DISPLAY_DURATION = 3000;

export default function EmailVerificationBanner({ email }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    const dismissedUntilRaw = localStorage.getItem("emailBannerDismissed");

    if (dismissedUntilRaw === null) {
      return;
    }

    const dismissedUntil = Number(dismissedUntilRaw);

    if (!Number.isNaN(dismissedUntil) && Date.now() < dismissedUntil) {
      setIsVisible(false);
    }
  }, []);

  function handleClose() {
    setIsVisible(false);

    const dismissUntil = Date.now() + BANNER_COOLDOWN_HOURS * 60 * 60 * 1000;
    localStorage.setItem("emailBannerDismissed", dismissUntil.toString());
  }

  async function handleResend() {
    setIsResending(true);
    try {
      await authClient.sendVerificationEmail({
        email,
      });
      setJustSent(true);
      setTimeout(() => {
        setJustSent(false);
      }, SUCCESS_DISPLAY_DURATION);
    } catch (error) {
      // Handle error silently or show a toast notification
      console.error("Failed to send verification email:", error);
    } finally {
      setIsResending(false);
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <header className="border-b bg-muted/50">
      <div className="container flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <EnvelopeIcon
            aria-hidden="true"
            className="size-4 shrink-0"
            weight="bold"
          />
          <p className="text-muted-foreground">
            Please verify your email address.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            disabled={isResending || justSent}
            onClick={handleResend}
            size="xs"
            variant={justSent ? "default" : "outline"}
          >
            {isResending && <Spinner />}
            {justSent && <CheckIcon weight="bold" />}
            {/** biome-ignore lint/style/noNestedTernary: <it is clear enough> */}
            {isResending ? "Sending..." : justSent ? "Sent" : "Resend email"}
          </Button>

          <Button
            aria-label="Dismiss banner"
            onClick={handleClose}
            size="icon-xs"
            variant="ghost"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
