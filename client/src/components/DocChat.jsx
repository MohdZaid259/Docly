import { useEffect, useRef, useState } from "react";
import { streamQuestion } from "../api/chat.api";
import { listConversations, createConversation, getConversation, deleteConversation } from "../api/conversation.api";
import toast from "react-hot-toast";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const toSources = (citations = []) =>
  citations.map((citation) => ({ text: citation.text, score: citation.score, page: citation.page }));

const DocumentChat = ({ documentId, onCitationClick }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const initChat = async () => {
      setInitializing(true);
      try {
        const listRes = await listConversations({ documentId, scope: "document" });
        let conversation = listRes.data[0];

        if (!conversation) {
          const createRes = await createConversation({ scope: "document", documentId });
          conversation = createRes.data;
        }

        const detailRes = await getConversation(conversation._id);
        if (cancelled) return;

        setChatId(conversation._id);
        setMessages(
          detailRes.data.messages.map((message) => ({
            role: message.role,
            content: message.content,
            sources: toSources(message.citations),
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    };

    initChat();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleClearChat = async () => {
    if (!chatId) return;
    try {
      await deleteConversation(chatId);
      const createRes = await createConversation({ scope: "document", documentId });
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

    const userMessage = { role: "user", content: currentQuestion };
    const assistantMessage = { role: "assistant", content: "", sources: [] };
    const conversationHistory = [...messages, userMessage];
    const nextMessages = [...conversationHistory, assistantMessage];

    setQuestion("");
    setMessages(nextMessages);
    setLoading(true);

    try {
      await streamQuestion({
        documentId,
        question: currentQuestion,
        messages: conversationHistory,
        chatId,
        token: localStorage.getItem("token"),
        onToken: (token) => {
          setMessages((prev) => {
            const copy = [...prev];
            const target = copy[copy.length - 1];
            if (!target || target.role !== "assistant") return prev;

            copy[copy.length - 1] = {
              ...target,
              content: `${target.content}${token}`,
            };
            return copy;
          });
        },
        onDone: (payload) => {
          setMessages((prev) => {
            const copy = [...prev];
            const target = copy[copy.length - 1];
            if (!target || target.role !== "assistant") return prev;

            copy[copy.length - 1] = {
              ...target,
              sources: payload.sources || [],
            };
            return copy;
          });
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to stream response right now.");

      setMessages((prev) => {
        const copy = [...prev];
        const target = copy[copy.length - 1];
        if (!target || target.role !== "assistant") return prev;

        copy[copy.length - 1] = {
          ...target,
          content: "Something went wrong while generating the answer.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[78vh] rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Chat</h3>
          <p className="text-sm text-muted-foreground">Ask questions about this document in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
            Live answers
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            disabled={initializing || !messages.length}
          >
            <RotateCcw className="size-3.5" />
            Clear chat
          </Button>
        </div>
      </div>

      <div className="chat-scroll mt-4 max-h-[56vh] min-h-[240px] space-y-3 overflow-y-auto rounded-2xl bg-muted/40 p-3 sm:p-4">
        {initializing && (
          <div className="message-bubble rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            Loading conversation...
          </div>
        )}

        {!initializing && messages.length === 0 && !loading && (
          <div className="message-bubble rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-6 text-foreground">
            Ask anything about the document and I'll answer from the uploaded content.
          </div>
        )}

        {messages.map((message, index) => {
          if (message.role === "assistant" && !message.content.trim()) {
            return null;
          }

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
                    <button
                      key={sourceIndex}
                      type="button"
                      onClick={() => onCitationClick?.(source)}
                      className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 transition hover:bg-emerald-500/20 dark:text-emerald-300"
                    >
                      {source.page ? `Page ${source.page}` : `${Math.round(source.score * 100)}% match`}
                    </button>
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
          placeholder="Ask about this document..."
          disabled={initializing}
          className="min-h-12 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-60"
        />

        <Button type="submit" disabled={loading || initializing} className="min-h-12 rounded-2xl px-5">
          {loading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default DocumentChat;
