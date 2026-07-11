import { Worker } from "bullmq";
import connection from "../configs/redis.js";
import Document from "../models/doc.model.js";
import { downloadFileFromS3 } from "../services/s3.service.js";
import { extractPdfText, extractDocxText, extractTxtText } from "../utils/extractor.js";
import { chunkText } from "../utils/chunkText.js";
import Chunk from "../models/chunk.model.js";
import { createEmbedding } from "../services/embedding.service.js";
import { generateSummary } from "../services/summary.service.js";

console.log("🚀 Doc worker started");

const worker = new Worker("document-processing",
  async (job) => {
    const { documentId } = job.data;

    try {
      const document = await Document.findById(documentId);
      if (!document) {
        throw new Error("Document not found");
      }

      await Document.findByIdAndUpdate(documentId, {
        status: "processing",
      });

      const buffer = await downloadFileFromS3(
        document.s3Key
      );

      let extracted;

      if (document.mimeType === "application/pdf") {
        extracted = await extractPdfText(buffer);
      } else if (document.mimeType === "text/plain") {
        extracted = extractTxtText(buffer);
      } else {
        extracted = await extractDocxText(buffer);
      }

      const extractedText = extracted.text;

      const summary = await generateSummary(extractedText);

      await Document.findByIdAndUpdate(documentId, {
        summary
      });

      const chunks = chunkText(extracted.pages);

      const embeddings = await Promise.all(
          chunks.map(chunk =>
            createEmbedding(chunk.text)
          )
        );

      await Chunk.insertMany(
        chunks.map((chunk, index) => ({
          document: documentId,
          chunkIndex: index,
          text: chunk.text,
          page: chunk.page,
          embedding: embeddings[index]
        }))
      );

      await Document.findByIdAndUpdate(documentId, {
        status: "completed",
        extractedText,
        summary
      });

      console.log(`Document processed: ${document.fileName}`);
    } catch (error) {
      console.error(error);
      await Document.findByIdAndUpdate(documentId, { status: "failed" });
    }
  },
  { connection }
);

export default worker;