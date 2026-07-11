import { Link } from "react-router-dom";
import { FileText, MoreVertical, Pin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { formatFileSize } from "@/helpers/formatFileSize";
import { getStatusBadgeVariant } from "@/helpers/statusColor";
import { deleteDocument, toggleDocumentPin } from "@/api/doc.api";

const STAGE_LABELS = {
  downloading: "downloading",
  extracting: "extracting text",
  summarizing: "generating summary",
  chunking: "chunking",
  embedding: "generating embeddings",
  saving: "saving",
};

const DocumentCard = ({ document, onDeleted, onPinToggled }) => {
  const handleDelete = async () => {
    try {
      await deleteDocument(document._id);
      toast.success("Document deleted");
      onDeleted?.(document._id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleTogglePin = async () => {
    try {
      const res = await toggleDocumentPin(document._id);
      onPinToggled?.(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't update document");
    }
  };

  return (
    <Card className="p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/documents/${document._id}`} className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate font-medium text-foreground">{document.fileName}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatFileSize(document.size)}</p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleTogglePin}
            aria-label={document.pinned ? "Unpin document" : "Pin document"}
          >
            <Pin className={`size-4 ${document.pinned ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Document actions">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/documents/${document._id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Badge variant={getStatusBadgeVariant(document.status)}>{document.status}</Badge>
        {document.status === "processing" && STAGE_LABELS[document.processingStage] && (
          <span className="text-xs text-muted-foreground">{STAGE_LABELS[document.processingStage]}</span>
        )}
      </div>
    </Card>
  );
};

export default DocumentCard;
