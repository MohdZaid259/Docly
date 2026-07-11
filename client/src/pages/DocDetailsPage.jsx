import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { getDocumentById } from "../api/doc.api";
import DocumentSummary from "../components/DocSummary";
import DocumentChat from "../components/DocChat";
import DocumentViewer from "../components/DocumentViewer";
import { formatFileSize } from "@/helpers/formatFileSize";
import { getStatusBadgeVariant } from "@/helpers/statusColor";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DocumentDetailsPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [jumpToPage, setJumpToPage] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await getDocumentById(id);
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
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-muted-foreground shadow-sm">
          Loading document...
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-foreground sm:text-3xl">{document.fileName}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{document.mimeType || "Unknown"}</Badge>
                <Badge variant="outline">{formatFileSize(document.size)}</Badge>
                <Badge variant={getStatusBadgeVariant(document.status)}>{document.status}</Badge>
              </div>
            </div>

            <a
              href={document.s3Url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Open original <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_440px]">
          <div>
            <Tabs defaultValue="chat">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <DocumentChat
                  documentId={document._id}
                  onCitationClick={(source) => {
                    if (source.page) setJumpToPage(source.page);
                  }}
                />
              </TabsContent>

              <TabsContent value="summary">
                <DocumentSummary summary={document.summary} status={document.status} />
              </TabsContent>

              <TabsContent value="info">
                <Card className="p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="mt-1 break-words text-foreground">{document.mimeType || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="mt-1 text-foreground">{formatFileSize(document.size)}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusBadgeVariant(document.status)} className="mt-2">
                      {document.status}
                    </Badge>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="h-[70vh] xl:h-[78vh]">
            <DocumentViewer document={document} jumpToPage={jumpToPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsPage;
