import { Route, Routes } from "react-router";

import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { EmptyLayout } from "./layouts/empty";
import { MainLayout } from "./layouts/main";
import { Providers } from "./providers";
import DashboardPage from "./routes/dashboard";
import { FoldersPage } from "./routes/folders";
import HomePage from "./routes/home";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";
import { SettingsPage } from "./routes/settings";
import { TagsPage } from "./routes/tags";

export default function App() {
  return (
    <NuqsAdapter>
      <Providers>
        <Routes>
          <Route element={<HomePage />} index />

          <Route element={<MainLayout />}>
            <Route element={<DashboardPage />} path="dashboard" />
            <Route element={<SettingsPage />} path="dashboard/settings" />
            <Route element={<FoldersPage />} path="dashboard/folders" />
            <Route element={<TagsPage />} path="dashboard/tags" />
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
