import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    citations: [
      {
        document: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
        fileName: String,
        page: { type: Number, default: null },
        text: String,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
