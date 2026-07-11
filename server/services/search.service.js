import mongoose from "mongoose";
import Chunk from "../models/chunk.model.js";
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
          page: 1,
          document: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

  return results;
};

export const searchChunksAcrossDocuments = async (documentIds, query, limit = 8) => {
  if (!documentIds?.length) {
    return [];
  }

  const queryEmbedding = await createEmbedding(query);
  const filter = { document: { $in: documentIds.map((id) => new mongoose.Types.ObjectId(id)) } };

  const results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector-index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
          filter,
        },
      },
      {
        $lookup: {
          from: "documents",
          localField: "document",
          foreignField: "_id",
          as: "documentInfo",
        },
      },
      { $unwind: "$documentInfo" },
      {
        $project: {
          text: 1,
          page: 1,
          document: 1,
          fileName: "$documentInfo.fileName",
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

  return results;
};
