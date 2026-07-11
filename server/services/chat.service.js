import { searchChunks, searchChunksAcrossDocuments } from "./search.service.js";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.MESHAPI_KEY,
  baseURL: "https://api.meshapi.ai/v1",
});

const SYSTEM_PROMPT = `
  You are a document assistant.
  Answer ONLY using the provided context.
  If the answer cannot be found in the context, respond:
  "I couldn't find that information in the uploaded documents."
  Never use outside knowledge.
`;

const GLOBAL_SYSTEM_PROMPT = `
  You are a document assistant with access to multiple documents.
  Answer ONLY using the provided context, which may span several documents.
  When relevant, mention which document a fact came from.
  If the answer cannot be found in the context, respond:
  "I couldn't find that information in the uploaded documents."
  Never use outside knowledge.
`;

const buildMemory = (messages) =>
  messages.slice(-5).map((message) => ({ role: message.role, content: message.content }));

const NO_MATCH_RESULT = {
  answer: "I couldn't find that information in the uploaded documents.",
  sources: [],
};

const toSources = (chunks) => {
  const seen = new Map();

  for (const chunk of chunks) {
    const key = `${chunk.document ?? ""}:${chunk.page ?? "none"}`;
    const existing = seen.get(key);
    if (!existing || chunk.score > existing.score) {
      seen.set(key, {
        text: chunk.text,
        score: chunk.score,
        page: chunk.page,
        ...(chunk.document ? { document: chunk.document, fileName: chunk.fileName } : {}),
      });
    }
  }

  return [...seen.values()].sort((a, b) => b.score - a.score);
};

export const askQuestion = async (documentId, question, messages = []) => {
  const chunks = await searchChunks(documentId, question);

  if (!chunks.length || chunks[0].score < 0.4) {
    return { ...NO_MATCH_RESULT };
  }

  const memory = buildMemory(messages);
  const context = chunks.map((chunk) => chunk.text).join("\n\n");

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...memory,
      { role: "user", content: `Context:\n${context}\nQuestion:\n${question}` },
    ],
  });

  return {
    answer: response.choices[0].message.content,
    sources: toSources(chunks),
  };
};

export const streamQuestion = async (documentId, question, messages = []) => {
  const chunks = await searchChunks(documentId, question);

  if (!chunks.length || chunks[0].score < 0.4) {
    return { ...NO_MATCH_RESULT, stream: null };
  }

  const memory = buildMemory(messages);
  const context = chunks.map((chunk) => chunk.text).join("\n\n");

  const stream = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...memory,
      { role: "user", content: `Context:\n${context}\nQuestion:\n${question}` },
    ],
    stream: true,
  });

  return {
    stream,
    sources: toSources(chunks),
  };
};

export const streamGlobalQuestion = async (documentIds, question, messages = []) => {
  const chunks = await searchChunksAcrossDocuments(documentIds, question);

  if (!chunks.length || chunks[0].score < 0.4) {
    return { ...NO_MATCH_RESULT, stream: null };
  }

  const memory = buildMemory(messages);
  const context = chunks
    .map((chunk) => `[${chunk.fileName}]\n${chunk.text}`)
    .join("\n\n");

  const stream = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: GLOBAL_SYSTEM_PROMPT },
      ...memory,
      { role: "user", content: `Context:\n${context}\nQuestion:\n${question}` },
    ],
    stream: true,
  });

  return {
    stream,
    sources: toSources(chunks),
  };
};
