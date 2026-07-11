import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { getDocuments } from "@/api/doc.api";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentCard from "@/components/DocumentCard";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
];

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
    const interval = setInterval(fetchDocs, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesQuery = doc.fileName.toLowerCase().includes(query.trim().toLowerCase());
      const matchesFilter = filter === "all" || doc.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [documents, query, filter]);

  const handleDeleted = (id) => setDocuments((prev) => prev.filter((doc) => doc._id !== id));
  const handlePinToggled = (updated) =>
    setDocuments((prev) => prev.map((doc) => (doc._id === updated._id ? updated : doc)));

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {documents.length} document{documents.length === 1 ? "" : "s"} in your library
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by file name..."
              className="pl-9"
            />
          </div>

          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              {FILTERS.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {documents.length === 0
              ? "No documents yet. Upload your first file to get started."
              : "No documents match your search."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((doc) => (
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
    </div>
  );
};

export default DocumentsPage;
