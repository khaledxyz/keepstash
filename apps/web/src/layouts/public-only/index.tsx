import { Navigate, Outlet, useLocation } from "react-router";

import { authClient } from "@/lib/auth-client";

export function PublicOnlyLayout() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  // Return null during loading - outer Suspense handles the loading state
  if (isPending) {
    return null;
  }

  if (session) {
    // Redirect authenticated users to their intended destination or dashboard
    const from = (location.state?.from?.pathname as string) || "/dashboard";
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
}
