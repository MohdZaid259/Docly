import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../utils/protectedRoute.jsx";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const DocumentsPage = lazy(() => import("../pages/DocumentsPage"));
const DocumentDetailsPage = lazy(() => import("../pages/DocDetailsPage"));
const GlobalChatPage = lazy(() => import("../pages/GlobalChatPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const BillingPage = lazy(() => import("../pages/BillingPage"));
const AppShell = lazy(() => import("../layouts/AppShell.jsx"));

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/:id" element={<DocumentDetailsPage />} />
          <Route path="/global-chat" element={<GlobalChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/billing" element={<BillingPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;