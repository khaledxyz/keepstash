import { Navigate, Outlet, useLocation } from "react-router";

import { authClient } from "@/lib/auth-client";

import { Spinner } from "@/components/ui/spinner";

export function PublicOnlyLayout() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="absolute top-0 left-0 grid h-screen w-screen place-items-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (session) {
    // Redirect authenticated users to their intended destination or dashboard
    const from = (location.state?.from?.pathname as string) || "/dashboard";
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
}
