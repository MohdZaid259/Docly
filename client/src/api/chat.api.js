import axiosInstance from "../utils/axiosInstance";

export const askQuestion = (documentId, question, messages) => {
  return axiosInstance.post("/chat", { documentId, question, messages });
};

const streamFromEndpoint = async (path, body, { token, onToken, onDone }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Unable to stream response");
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by the current browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (buffer.trim()) {
        const payload = JSON.parse(buffer.replace(/^data:\s*/, ""));
        if (payload.done) {
          onDone(payload);
        }
      }
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      if (!event.startsWith("data:")) continue;

      const payload = JSON.parse(event.replace(/^data:\s*/, ""));

      if (payload.token) {
        onToken(payload.token);
      }

      if (payload.done) {
        onDone(payload);
      }
    }
  }
};

export const streamQuestion = ({ documentId, question, messages, chatId, token, onToken, onDone }) => {
  return streamFromEndpoint(
    "/chat/stream",
    { documentId, question, messages, chatId },
    { token, onToken, onDone }
  );
};

export const streamGlobalQuestion = ({ documentIds, question, messages, chatId, token, onToken, onDone }) => {
  return streamFromEndpoint(
    "/chat/global/stream",
    { documentIds, question, messages, chatId },
    { token, onToken, onDone }
  );
};
