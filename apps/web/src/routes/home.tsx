import { Navigate } from "react-router";

import { env, isFeatureEnabled } from "@/lib/env";

export default function HomePage() {
  const enableRootRedirect = isFeatureEnabled(env.enableRootRedirect);

  if (enableRootRedirect) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div>
      <h1>homepage</h1>
      <p>main landing page content will go here</p>
    </div>
  );
}
