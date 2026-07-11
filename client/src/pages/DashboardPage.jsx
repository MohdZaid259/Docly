import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Pin, HardDrive } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { getDocuments } from "@/api/doc.api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadForm from "@/components/UploadForm";
import DocumentCard from "@/components/DocumentCard";
import { formatFileSize } from "@/helpers/formatFileSize";

const DashboardPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await getDocuments();
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
    const interval = setInterval(fetchDocs, 4000);
    return () => clearInterval(interval);
  }, [fetchDocs]);

  const pinnedDocuments = useMemo(() => documents.filter((doc) => doc.pinned), [documents]);
  const recentDocuments = useMemo(() => documents.slice(0, 4), [documents]);
  const totalStorage = useMemo(
    () => documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
    [documents]
  );

  const handleDeleted = (id) => setDocuments((prev) => prev.filter((doc) => doc._id !== id));
  const handlePinToggled = (updated) =>
    setDocuments((prev) => prev.map((doc) => (doc._id === updated._id ? updated : doc)));

  const stats = [
    { label: "Documents", value: documents.length, icon: FileText },
    { label: "Pinned", value: pinnedDocuments.length, icon: Pin },
    { label: "Storage used", value: formatFileSize(totalStorage), icon: HardDrive },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Welcome back, {user?.name || "there"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Keep your documents organized and easy to review.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="flex items-center gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent documents</h2>
              {documents.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/documents">View all</Link>
                </Button>
              )}
            </div>

            {loading ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Loading documents...
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No documents yet. Upload your first file to get started.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {recentDocuments.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    document={doc}
                    onDeleted={handleDeleted}
                    onPinToggled={handlePinToggled}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <UploadForm onUploaded={fetchDocs} />

            {pinnedDocuments.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Pinned</h2>
                <div className="space-y-3">
                  {pinnedDocuments.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      document={doc}
                      onDeleted={handleDeleted}
                      onPinToggled={handlePinToggled}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
