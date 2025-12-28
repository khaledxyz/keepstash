import { Outlet } from "react-router";

export function EmptyLayout() {
  return (
    <main className="h-full w-full">
      <Outlet />
    </main>
  );
}
