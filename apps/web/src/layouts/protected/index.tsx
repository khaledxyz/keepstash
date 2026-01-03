import { Navigate, Outlet, useLocation } from "react-router";

import { authClient } from "@/lib/auth-client";

import { LoadingScreen } from "@/components/loading-screen";

export function ProtectedLayout() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
