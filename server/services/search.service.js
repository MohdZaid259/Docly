import mongoose from "mongoose";
import Chunk from "../models/Chunk.model.js";
import { createEmbedding } from "./embedding.service.js";

export const searchChunks = async (documentId, query) => {
  const queryEmbedding = await createEmbedding(query);

  const results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector-index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 5,
          filter: { document: new mongoose.Types.ObjectId(documentId) },
        },
      },
      {
        $project: {
          text: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

  return results;
};