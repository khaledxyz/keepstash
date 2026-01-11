import { Navigate, Outlet, useLocation } from "react-router";

import { authClient } from "@/lib/auth-client";

export function ProtectedLayout() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  // Return null during loading - outer Suspense handles the loading state
  if (isPending) {
    return null;
  }

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
