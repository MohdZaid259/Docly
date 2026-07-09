import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.MESHAPI_KEY,
});

export const createEmbedding = async (text) => {
  const response =
    await openrouter.embeddings.generate({
      requestBody: {
        model: "openai/text-embedding-3-small",
        input: text,
        encodingFormat: "float",
      },
    });

  return response.data[0].embedding;
};