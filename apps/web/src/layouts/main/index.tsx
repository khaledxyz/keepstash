import { Activity } from "react";
import { Outlet } from "react-router";

import { authClient } from "@/lib/auth-client";

import { Modals } from "@/providers/modals";

import EmailVerificationBanner from "@/components/email-verification-banner";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

import { Navbar } from "./_components/navbar";

export function MainLayout() {
  const { data: session, isPending } = authClient.useSession();

  const shouldShowBanner = session && !session.user.emailVerified;

  return (
    <>
      {/* TODO: find a better location for this dialog */}
      <Modals />
      <PWAInstallPrompt />
      {!isPending && (
        <Activity mode={shouldShowBanner ? "visible" : "hidden"}>
          <EmailVerificationBanner email={session?.user.email ?? ""} />
        </Activity>
      )}
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <footer />
      <MobileBottomBar />
    </>
  );
}
