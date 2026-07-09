import UploadForm from "../components/UploadForm";
import DocumentList from "../components/DocList";
import useAuth from "../hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Welcome back, {user?.name || "there"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Keep your documents organized and easy to review.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <UploadForm />
          <DocumentList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;