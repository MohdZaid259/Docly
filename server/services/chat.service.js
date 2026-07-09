import { searchChunks } from "./search.service.js";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.MESHAPI_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const askQuestion = async (documentId, question, messages = []) => {
  const chunks = await searchChunks(documentId, question);
  console.log(chunks.map((c) => ({
      score: c.score,
      text: c.text.slice(0, 100),
    }))
  );

  if (!chunks.length || chunks[0].score < 0.4) {
    return {
      answer: "I couldn't find that information in the uploaded documents.",
      sources: [],
    };
  }

  const memory = messages
    .slice(-5)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  const context = chunks.map(chunk => chunk.text).join("\n\n");

  const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a document assistant.
            Answer ONLY using the provided context.
            If the answer cannot be found in the context, respond:
            "I couldn't find that information in the uploaded documents."
            Never use outside knowledge.
          `,
        },
        ...memory,
        {
          role: "user",
          content: `
            Context:
            ${context}
            Question:
            ${question}
          `,
        },
      ],
    });

    return { 
      answer: response.choices[0].message.content,
      sources: chunks.map((chunk) => ({
        text: chunk.text,
        score: chunk.score,
      })),
    };
};

export const streamQuestion = async (documentId, question, messages = []) => {
  const chunks = await searchChunks(documentId, question);
  console.log(chunks.map((c) => ({
      score: c.score,
      text: c.text.slice(0, 100),
    }))
  );
  
  if (!chunks.length || chunks[0].score < 0.4) {
    return {
      answer: "I couldn't find that information in the uploaded documents.",
      sources: [],
      stream: null,
    };
  }

  const memory = messages
    .slice(-5)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  const context = chunks.map((chunk) => chunk.text).join("\n\n");

  const stream =await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a document assistant.
            Answer ONLY using the provided context.
            Never use outside knowledge.
            `,
        },
        ...memory,
        {
          role: "user",
          content: `
            Context:
            ${context}

            Question:
            ${question}
          `,
        },
      ],
      stream: true,
    });

  return {
    stream,
    sources: chunks.map((chunk) => ({
      text: chunk.text,
      score: chunk.score,
    })),
  };
};