import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      default: null,
    },
    embedding: {
      type: [Number],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chunk", chunkSchema);