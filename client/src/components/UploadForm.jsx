import { useState } from "react";
import { uploadDocument } from "../api/doc.api";
import toast from "react-hot-toast";

const allowedExtensions = [".pdf", ".docx", ".txt"];
const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const isAllowedFile = (selectedFile) => {
  if (!selectedFile) return false;
  const fileName = selectedFile.name.toLowerCase();
  const mimeType = selectedFile.type.toLowerCase();

  return (
    allowedExtensions.some((extension) => fileName.endsWith(extension)) ||
    allowedMimeTypes.includes(mimeType)
  );
};

const UploadForm = ({ onUploaded, hideTitle = false }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && !isAllowedFile(selectedFile)) {
      toast.error("Only PDF, DOCX, and TXT files are allowed.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a PDF, DOCX, or TXT file to upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("document", file);

      await uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setFile(null);
      e.target.reset();
      onUploaded?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={hideTitle ? "" : "glass-panel p-5"}>
      {!hideTitle && (
        <div className="mb-4 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white">Upload a document</h3>
          <p className="mt-1 text-sm text-slate-400">Accepted files: PDF, DOCX, TXT</p>
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (!droppedFile) return;

          if (!isAllowedFile(droppedFile)) {
            toast.error("Only PDF, DOCX, and TXT files are allowed.");
            return;
          }

          setFile(droppedFile);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center transition ${
          dragActive
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-indigo-500/10"
        }`}
      >
        <span className="text-sm font-medium text-slate-100">
          {file ? file.name : "Choose a file to upload"}
        </span>
        <span className="mt-2 text-xs text-slate-400">PDF, Word, or text document</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileChange}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload document"}
      </button>
    </form>
  );
};

export default UploadForm;