import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const DocumentViewer = ({ document, jumpToPage }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(520);
  const [lastJumpToPage, setLastJumpToPage] = useState(jumpToPage);
  const containerRef = useRef(null);

  if (jumpToPage !== lastJumpToPage) {
    setLastJumpToPage(jumpToPage);
    if (jumpToPage) setPageNumber(jumpToPage);
  }

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setPageWidth(Math.min(width - 16, 700));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const fileSource = useMemo(
    () => ({
      url: `${import.meta.env.VITE_API_URL}/documents/${document._id}/file`,
      httpHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
    [document._id]
  );

  if (document.mimeType !== "application/pdf") {
    return (
      <div className="h-full overflow-y-auto rounded-2xl border border-border bg-card p-5">
        {document.extractedText ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{document.extractedText}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No preview available yet.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
      <div ref={containerRef} className="flex flex-1 justify-center overflow-auto rounded-xl bg-muted/40 p-2">
        <Document
          file={fileSource}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          loading={<p className="p-6 text-sm text-muted-foreground">Loading PDF...</p>}
          error={<p className="p-6 text-sm text-muted-foreground">Couldn't load this PDF.</p>}
        >
          <Page pageNumber={pageNumber} width={pageWidth} />
        </Document>
      </div>

      {numPages && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((page) => Math.min(numPages, page + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
