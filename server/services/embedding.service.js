import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.MESHAPI_KEY,
  baseURL: "https://api.meshapi.ai/v1",
});

export const createEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "openai/text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  return response.data[0].embedding;
};