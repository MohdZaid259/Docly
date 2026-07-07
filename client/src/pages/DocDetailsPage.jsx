import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocumentById } from "../api/doc.api";
import DocumentSummary from "../components/DocSummary";
import DocumentChat from "../components/DocChat";

const formatFileSize = (size) => {
  if (!size) return "0 KB";

  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (
    value >= 1024 &&
    unitIndex < units.length - 1
  ) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(
    value >= 10 || unitIndex === 0 ? 0 : 1
  )} ${units[unitIndex]}`;
};

const getStatusClasses = (status) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";

    case "processing":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";

    case "failed":
      return "bg-red-500/15 text-red-400 border border-red-500/20";

    default:
      return "bg-slate-500/15 text-slate-400 border border-slate-500/20";
  }
};

const DocumentDetailsPage = () => {
  const { id } = useParams();

  const [document, setDocument] =
    useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res =
          await getDocumentById(id);

        setDocument(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDocument();
  }, [id]);

  if (!document) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-5 text-slate-400 shadow-[0_20px_80px_-25px_rgba(99,102,241,0.55)] backdrop-blur-xl">
          Loading document...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">AI Document Assistant</p>
              <h1 className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl">{document.fileName}</h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{document.mimeType || "Unknown"}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{formatFileSize(document.size)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(document.status)}`}>{document.status}</span>
              </div>
            </div>

            <a
              href={document.s3Url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-600"
            >
              Open Document
            </a>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <DocumentChat documentId={document._id} />
            <DocumentSummary summary={document.summary} status={document.status} />
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Document Info</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="mt-1 break-words text-slate-200">{document.mimeType || "Unknown"}</p>
                </div>

                <div>
                  <p className="text-slate-500">Size</p>
                  <p className="mt-1 text-slate-200">{formatFileSize(document.size)}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm text-slate-500">Status</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(document.status)}`}>{document.status}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsPage;