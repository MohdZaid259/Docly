import { useEffect, useRef, useState } from "react";
import { streamQuestion } from "../api/chat.api";
import toast from "react-hot-toast";

const DocumentChat = ({ documentId }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentQuestion = question.trim();

    if (!currentQuestion || loading) return;

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
    <div className="flex flex-col max-h-[78vh] rounded-[24px] border border-white/10 bg-slate-900/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">AI Chat</h3>
          <p className="text-sm text-slate-400">Ask questions about this document in real time.</p>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Live answers
        </div>
      </div>

      <div className="chat-scroll mt-4 max-h-[56vh] min-h-[240px] space-y-3 overflow-y-auto rounded-2xl bg-slate-950/50 p-3 sm:p-4">
        {messages.length === 0 && !loading && (
          <div className="message-bubble rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-sm leading-6 text-slate-300">
            Ask anything about the document and I’ll answer from the uploaded content.
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
                  ? "ml-auto max-w-[92%] border border-indigo-400/20 bg-indigo-500/20 text-white"
                  : "mr-auto max-w-full border border-white/10 bg-white/5 text-slate-200 sm:max-w-[92%]"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === "assistant" && message.sources?.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                    {(Math.max(...message.sources.map((source) => source.score), 0) * 100).toFixed(0)}% relevance
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="message-bubble mr-auto max-w-[84%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="typing-dot h-2.5 w-2.5 rounded-full bg-indigo-400" />
              <span className="typing-dot h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="typing-dot h-2.5 w-2.5 rounded-full bg-emerald-400" />
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
          className="min-h-[48px] flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:bg-slate-800/70"
        />

        <button
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default DocumentChat;