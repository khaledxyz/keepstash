import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Route, Routes } from "react-router";

import HomePage from "./routes";
import DashboardPage from "./routes/dashboard";

export default function App() {
  return (
    <NuqsAdapter>
      <Routes>
        <Route element={<HomePage />} index />
        <Route element={<DashboardPage />} path="dashboard" />
      </Routes>
    </NuqsAdapter>
  );
}
