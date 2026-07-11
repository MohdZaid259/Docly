import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Layers, Check, X, RotateCcw } from "lucide-react";

import { getDocuments } from "@/api/doc.api";
import { streamGlobalQuestion } from "@/api/chat.api";
import { listConversations, createConversation, getConversation, deleteConversation } from "@/api/conversation.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const toSources = (citations = []) =>
  citations.map((citation) => ({
    text: citation.text,
    score: citation.score,
    page: citation.page,
    fileName: citation.fileName,
  }));

const GlobalChatPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const endRef = useRef(null);

  const loadConversation = async () => {
    const listRes = await listConversations({ scope: "global" });
    let conversation = listRes.data[0];

    if (!conversation) {
      const createRes = await createConversation({ scope: "global", documentIds: [] });
      conversation = createRes.data;
    }

    const detailRes = await getConversation(conversation._id);
    setChatId(conversation._id);
    setMessages(
      detailRes.data.messages.map((message) => ({
        role: message.role,
        content: message.content,
        sources: toSources(message.citations),
      }))
    );
  };

  useEffect(() => {
    const init = async () => {
      setInitializing(true);
      try {
        const docsRes = await getDocuments();
        setDocuments(docsRes.data);
        setSelectedIds(docsRes.data.map((doc) => doc._id));
        await loadConversation();
      } catch (error) {
        console.error(error);
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const toggleDocument = (docId) => {
    setSelectedIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleClearChat = async () => {
    if (!chatId) return;
    try {
      await deleteConversation(chatId);
      const createRes = await createConversation({ scope: "global", documentIds: [] });
      setChatId(createRes.data._id);
      setMessages([]);
      toast.success("Chat history cleared");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't clear chat history");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentQuestion = question.trim();

    if (!currentQuestion || loading || initializing) return;

    if (selectedIds.length === 0) {
      toast.error("Select at least one document to chat with.");
      return;
    }

    const userMessage = { role: "user", content: currentQuestion };
    const assistantMessage = { role: "assistant", content: "", sources: [] };
    const conversationHistory = [...messages, userMessage];
    const nextMessages = [...conversationHistory, assistantMessage];

    setQuestion("");
    setMessages(nextMessages);
    setLoading(true);

    try {
      await streamGlobalQuestion({
        documentIds: selectedIds,
        question: currentQuestion,
        messages: conversationHistory,
        chatId,
        token: localStorage.getItem("token"),
        onToken: (token) => {
          setMessages((prev) => {
            const copy = [...prev];
            const target = copy[copy.length - 1];
            if (!target || target.role !== "assistant") return prev;

            copy[copy.length - 1] = { ...target, content: `${target.content}${token}` };
            return copy;
          });
        },
        onDone: (payload) => {
          setMessages((prev) => {
            const copy = [...prev];
            const target = copy[copy.length - 1];
            if (!target || target.role !== "assistant") return prev;

            copy[copy.length - 1] = { ...target, sources: payload.sources || [] };
            return copy;
          });
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to stream response right now.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDocuments = documents.filter((doc) => selectedIds.includes(doc._id));

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Global Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions across multiple documents at once — compare, cross-reference, or search your whole library.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="h-fit space-y-3 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="size-4" />
              Documents ({selectedIds.length}/{documents.length})
            </div>

            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Upload documents to start a global chat.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDocuments.map((doc) => (
                    <Badge key={doc._id} variant="secondary" className="max-w-full gap-1 pr-1">
                      <span className="max-w-36 truncate">{doc.fileName}</span>
                      <button
                        type="button"
                        onClick={() => toggleDocument(doc._id)}
                        aria-label={`Remove ${doc.fileName}`}
                        className="rounded-full p-0.5 hover:bg-background/60"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={() => setPickerOpen(true)}>
                  + Add documents
                </Button>

                <CommandDialog open={pickerOpen} onOpenChange={setPickerOpen}>
                  <CommandInput placeholder="Search documents..." />
                  <CommandList>
                    <CommandEmpty>No documents found.</CommandEmpty>
                    <CommandGroup>
                      {documents.map((doc) => (
                        <CommandItem key={doc._id} value={doc.fileName} onSelect={() => toggleDocument(doc._id)}>
                          <Check
                            className={`size-4 ${
                              selectedIds.includes(doc._id) ? "text-primary opacity-100" : "opacity-0"
                            }`}
                          />
                          <span className="truncate">{doc.fileName}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </>
            )}
          </Card>

          <div className="flex flex-col max-h-[70vh] rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-end">
              <Button variant="ghost" size="sm" onClick={handleClearChat} disabled={initializing || !messages.length}>
                <RotateCcw className="size-3.5" />
                Clear chat
              </Button>
            </div>

            <div className="chat-scroll flex-1 space-y-3 overflow-y-auto rounded-2xl bg-muted/40 p-3 sm:p-4">
              {initializing && (
                <div className="message-bubble rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  Loading conversation...
                </div>
              )}

              {!initializing && messages.length === 0 && !loading && (
                <div className="message-bubble rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-6 text-foreground">
                  Ask something across your selected documents — e.g. "compare these two contracts" or "how well does this resume match this job description."
                </div>
              )}

              {messages.map((message, index) => {
                if (message.role === "assistant" && !message.content.trim()) return null;

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`message-bubble rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "ml-auto max-w-[92%] border border-primary/20 bg-primary/20 text-foreground"
                        : "mr-auto max-w-full border border-border bg-background text-foreground sm:max-w-[92%]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.role === "assistant" && message.sources?.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {message.sources.map((source, sourceIndex) => (
                          <span
                            key={sourceIndex}
                            className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300"
                          >
                            {source.fileName}
                            {source.page ? ` — Page ${source.page}` : ` — ${Math.round(source.score * 100)}% match`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="message-bubble mr-auto max-w-[84%] rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="typing-dot h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="typing-dot h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="typing-dot h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask across your selected documents..."
                disabled={initializing}
                className="min-h-12 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-60"
              />
              <Button type="submit" disabled={loading || initializing} className="min-h-12 rounded-2xl px-5">
                {loading ? "Thinking..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalChatPage;
