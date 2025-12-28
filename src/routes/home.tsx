import { Navigate } from "react-router";

export default function HomePage() {
  const enableRootRedirect =
    import.meta.env.VITE_ENABLE_ROOT_REDIRECT === "true";

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
