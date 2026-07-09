import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../api/doc.api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getStatusColor } from "../helpers/statusColor";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDocs();

    const interval = setInterval(fetchDocs, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);
      toast.success("Document deleted");

      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-center sm:text-left">
        <h3 className="text-lg font-semibold text-white">Your documents</h3>
        <span className="text-sm text-slate-400">
          {documents.length} item{documents.length === 1 ? "" : "s"}
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
          No documents yet. Upload your first file to get started.
        </div>
      ) : (
        documents.map((doc) => (
          <div
            key={doc._id}
            className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_15px_40px_-20px_rgba(15,23,42,0.95)] transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-slate-800/70"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h4 className="truncate font-medium text-white">{doc.fileName}</h4>
                <p className={`mt-1 text-sm ${getStatusColor(doc.status)}`}>{doc.status}</p>
                <p className="mt-1 text-sm text-slate-400">{(doc.size / 1024).toFixed(2)} KB</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/documents/${doc._id}`}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/25"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentList;