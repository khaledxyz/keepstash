import { Outlet } from "react-router";

import { Navbar } from "./_components/navbar";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer />
    </>
  );
}
