import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { ErrorBoundary } from "./components/error-boundary";
import { LoadingScreen } from "./components/loading-screen";
import { EmptyLayout } from "./layouts/empty";
import { MainLayout } from "./layouts/main";
import { ProtectedLayout } from "./layouts/protected";
import { PublicOnlyLayout } from "./layouts/public-only";
import { Providers } from "./providers";
import HomePage from "./routes/home";

// Lazy load route components for code splitting
const DashboardPage = lazy(() => import("./routes/dashboard"));
const SettingsPage = lazy(() => import("./routes/settings"));
const ProfilePage = lazy(() => import("./routes/profile"));
const FoldersPage = lazy(() => import("./routes/folders"));
const TagsPage = lazy(() => import("./routes/tags"));
const RegisterPage = lazy(() => import("./routes/register"));
const LoginPage = lazy(() => import("./routes/login"));
const ForgotPasswordPage = lazy(() => import("./routes/forgot-password"));
const NotFoundPage = lazy(() => import("./routes/not-found"));

export default function App() {
  return (
    <NuqsAdapter>
      <Providers>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
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
                  <Route element={<HomePage />} index />
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
          </Suspense>
        </ErrorBoundary>
      </Providers>
    </NuqsAdapter>
  );
}
