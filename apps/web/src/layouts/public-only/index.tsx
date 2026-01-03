import { Navigate, Outlet, useLocation } from "react-router";

import { authClient } from "@/lib/auth-client";

import { LoadingScreen } from "@/components/loading-screen";

export function PublicOnlyLayout() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (session) {
    // Redirect authenticated users to their intended destination or dashboard
    const from = (location.state?.from?.pathname as string) || "/dashboard";
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
}
