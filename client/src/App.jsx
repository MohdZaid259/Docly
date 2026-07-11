import { Toaster } from "sonner";
import useAuth from "./hooks/useAuth";
import useTheme from "./hooks/useTheme";
import AppRoutes from "./routes/AppRoute";

function App() {
  const { loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-center text-sm text-muted-foreground shadow-sm">
          <div className="mx-auto mb-3 h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster theme={theme} position="top-right" richColors closeButton />
      <AppRoutes />
    </>
  );
}

export default App;