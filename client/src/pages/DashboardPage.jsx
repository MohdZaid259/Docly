import UploadForm from "../components/UploadForm";
import DocumentList from "../components/DocList";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="glass-panel px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">Docly</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Welcome back, {user?.name || "there"}</h2>
              <p className="mt-2 text-sm text-slate-400">Keep your documents organized and easy to review.</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <UploadForm />
          <DocumentList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;