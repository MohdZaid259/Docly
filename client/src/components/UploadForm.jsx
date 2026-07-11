import { useRef, useState } from "react";
import { X, FileText } from "lucide-react";
import { uploadDocument } from "../api/doc.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isAllowedFile, ACCEPT_ATTRIBUTE } from "@/helpers/fileValidation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const UploadForm = ({ onUploaded, hideTitle = false }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const fileInputRef = useRef(null);
  const duplicateChoiceRef = useRef(null);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    const valid = incoming.filter(isAllowedFile);
    const rejectedCount = incoming.length - valid.length;

    if (rejectedCount > 0) {
      toast.error(
        rejectedCount === 1
          ? "One file was skipped — only PDF, DOCX, and TXT are allowed."
          : `${rejectedCount} files were skipped — only PDF, DOCX, and TXT are allowed.`
      );
    }

    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const waitForDuplicateChoice = (targetFile, existingDocument) => {
    setDuplicate({ file: targetFile, existingDocument });
    return new Promise((resolve) => {
      duplicateChoiceRef.current = resolve;
    });
  };

  const uploadOne = async (targetFile, replaceId) => {
    const formData = new FormData();
    formData.append("document", targetFile);
    if (replaceId) formData.append("replaceId", replaceId);
    await uploadDocument(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      toast.error("Please select at least one PDF, DOCX, or TXT file to upload.");
      return;
    }

    setLoading(true);
    let uploaded = 0;
    let replaced = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const targetFile = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        await uploadOne(targetFile);
        uploaded++;
      } catch (error) {
        if (error?.response?.status === 409) {
          const result = await waitForDuplicateChoice(targetFile, error.response.data.existingDocument);
          setDuplicate(null);

          if (result.choice === "replace") {
            try {
              await uploadOne(targetFile, result.existingDocumentId);
              replaced++;
            } catch {
              failed++;
            }
          } else {
            skipped++;
          }
        } else {
          failed++;
        }
      }
    }

    setProgress(null);
    setLoading(false);
    setFiles([]);

    const parts = [];
    if (uploaded) parts.push(`${uploaded} uploaded`);
    if (replaced) parts.push(`${replaced} replaced`);
    if (skipped) parts.push(`${skipped} skipped`);
    if (failed) parts.push(`${failed} failed`);
    toast[failed && !uploaded && !replaced ? "error" : "success"](parts.join(", ") || "Done");

    onUploaded?.();
  };

  const handleReplace = () => {
    duplicateChoiceRef.current?.({ choice: "replace", existingDocumentId: duplicate.existingDocument._id });
  };

  const handleSkip = () => {
    duplicateChoiceRef.current?.({ choice: "skip" });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(!hideTitle && "rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-5")}
      >
        {!hideTitle && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Upload documents</h3>
            <p className="mt-1 text-sm text-muted-foreground">Accepted files: PDF, DOCX, TXT</p>
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
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
          )}
        >
          <span className="text-sm font-medium text-foreground">
            {files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected` : "Choose files to upload"}
          </span>
          <span className="mt-2 text-xs text-muted-foreground">
            {files.length ? "Click to add more" : "PDF, Word, or text documents"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept={ACCEPT_ATTRIBUTE}
            onChange={handleFileChange}
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
            {files.map((f, index) => (
              <li
                key={`${f.name}-${f.lastModified}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-foreground">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${f.name}`}
                  className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <Button
          type={files.length ? "submit" : "button"}
          onClick={files.length ? undefined : () => fileInputRef.current?.click()}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading
            ? `Uploading${progress ? ` ${progress.current}/${progress.total}` : "..."}`
            : files.length > 1
            ? `Upload ${files.length} documents`
            : "Upload document"}
        </Button>
      </form>

      <Dialog open={!!duplicate} onOpenChange={(open) => !open && handleSkip()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document already exists</DialogTitle>
            <DialogDescription>
              A document named "{duplicate?.existingDocument?.fileName}" already exists. Replace it with
              this new file, or skip this one?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleReplace}>Replace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadForm;
