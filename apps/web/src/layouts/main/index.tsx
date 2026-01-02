import { Activity } from "react";
import { Outlet } from "react-router";

import { authClient } from "@/lib/auth-client";

import EmailVerificationBanner from "@/components/email-verification-banner";

import { Navbar } from "./_components/navbar";

export function MainLayout() {
  const { data: session, isPending } = authClient.useSession();

  const shouldShowBanner = session && !session.user.emailVerified;

  return (
    <>
      {!isPending && (
        <Activity mode={shouldShowBanner ? "visible" : "hidden"}>
          <EmailVerificationBanner email={session?.user.email ?? ""} />
        </Activity>
      )}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer />
    </>
  );
}
