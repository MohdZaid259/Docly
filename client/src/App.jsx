import useAuth from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-5 text-center text-slate-300 shadow-[0_20px_80px_-25px_rgba(99,102,241,0.55)] backdrop-blur-xl sm:px-8 sm:py-6">
          <div className="mx-auto mb-3 h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-400" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;