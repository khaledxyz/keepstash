import { Navigate, Outlet, useLocation } from "react-router";

import { authClient } from "@/lib/auth-client";

import { Spinner } from "@/components/ui/spinner";

export function ProtectedLayout() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="absolute top-0 left-0 grid h-screen w-screen place-items-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
