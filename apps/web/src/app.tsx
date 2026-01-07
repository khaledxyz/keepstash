import { Route, Routes } from "react-router";

import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { ErrorBoundary } from "./components/error-boundary";
import { EmptyLayout } from "./layouts/empty";
import { MainLayout } from "./layouts/main";
import { ProtectedLayout } from "./layouts/protected";
import { PublicOnlyLayout } from "./layouts/public-only";
import { Providers } from "./providers";
import DashboardPage from "./routes/dashboard";
import { FoldersPage } from "./routes/folders";
import { ForgotPasswordPage } from "./routes/forgot-password";
import HomePage from "./routes/home";
import { LoginPage } from "./routes/login";
import { NotFoundPage } from "./routes/not-found";
import { ProfilePage } from "./routes/profile";
import { RegisterPage } from "./routes/register";
import { SettingsPage } from "./routes/settings";
import { TagsPage } from "./routes/tags";

export default function App() {
  return (
    <NuqsAdapter>
      <Providers>
        <ErrorBoundary>
          <Routes>
            <Route element={<HomePage />} index />

            {/* Protected routes - require authentication */}
            <Route element={<ProtectedLayout />}>
              <Route element={<MainLayout />}>
                <Route element={<DashboardPage />} path="dashboard" />
                <Route element={<SettingsPage />} path="dashboard/settings" />
                <Route element={<ProfilePage />} path="dashboard/profile" />
                <Route element={<FoldersPage />} path="dashboard/folders" />
                <Route element={<TagsPage />} path="dashboard/tags" />
              </Route>
            </Route>

            {/* Public-only routes - redirect if authenticated */}
            <Route element={<PublicOnlyLayout />}>
              <Route element={<EmptyLayout />}>
                <Route element={<RegisterPage />} path="register" />
                <Route element={<LoginPage />} path="login" />
                <Route
                  element={<ForgotPasswordPage />}
                  path="forgot-password"
                />
              </Route>
            </Route>

            {/* 404 catch-all route */}
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </ErrorBoundary>
      </Providers>
    </NuqsAdapter>
  );
}
