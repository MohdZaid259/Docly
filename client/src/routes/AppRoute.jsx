import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import DocumentDetailsPage from "../pages/DocDetailsPage";
import ProtectedRoute from "../utils/protectedRoute.jsx";

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
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
};

export default AppRoutes;