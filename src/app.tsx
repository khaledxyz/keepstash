import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Route, Routes } from "react-router";

import { EmptyLayout } from "./layouts/empty";
import { MainLayout } from "./layouts/main";
import { Providers } from "./providers";
import DashboardPage from "./routes/dashboard";
import HomePage from "./routes/home";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";

export default function App() {
  return (
    <NuqsAdapter>
      <Providers>
        <Routes>
          <Route element={<HomePage />} index />

          <Route element={<MainLayout />}>
            <Route element={<DashboardPage />} path="dashboard" />
          </Route>

          <Route element={<EmptyLayout />}>
            <Route element={<RegisterPage />} path="register" />
            <Route element={<LoginPage />} path="login" />
          </Route>
        </Routes>
      </Providers>
    </NuqsAdapter>
  );
}
