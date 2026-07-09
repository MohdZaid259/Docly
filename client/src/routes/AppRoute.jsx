import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import DocumentDetailsPage from "../pages/DocDetailsPage";
import ProtectedRoute from "../utils/protectedRoute.jsx";
import AppShell from "../layouts/AppShell.jsx";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" />
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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/documents/:id" element={<DocumentDetailsPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
};

export default AppRoutes;