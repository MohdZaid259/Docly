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

const EMBEDDING_BATCH_SIZE = 5;

const embedInBatches = async (chunks) => {
  const embeddings = [];

  for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);
    const batchEmbeddings = await Promise.all(batch.map((chunk) => createEmbedding(chunk.text)));
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
};

const setStage = (documentId, processingStage) =>
  Document.findByIdAndUpdate(documentId, { processingStage });

const worker = new Worker(
  "document-processing",
  async (job) => {
    const { documentId } = job.data;

    const document = await Document.findById(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await Document.findByIdAndUpdate(documentId, { status: "processing", processingStage: "downloading" });
    await job.updateProgress(10);

    const buffer = await downloadFileFromS3(document.s3Key);

    await setStage(documentId, "extracting");
    await job.updateProgress(25);

    let extracted;
    if (document.mimeType === "application/pdf") {
      extracted = await extractPdfText(buffer);
    } else if (document.mimeType === "text/plain") {
      extracted = extractTxtText(buffer);
    } else {
      extracted = await extractDocxText(buffer);
    }

    const extractedText = extracted.text;

    await setStage(documentId, "summarizing");
    await job.updateProgress(45);

    const summary = await generateSummary(extractedText);
    await Document.findByIdAndUpdate(documentId, { summary });

    await setStage(documentId, "chunking");
    await job.updateProgress(60);

    const chunks = chunkText(extracted.pages);

    await setStage(documentId, "embedding");
    await job.updateProgress(70);

    const embeddings = await embedInBatches(chunks);

    await setStage(documentId, "saving");
    await job.updateProgress(90);

    await Chunk.insertMany(
      chunks.map((chunk, index) => ({
        document: documentId,
        chunkIndex: index,
        text: chunk.text,
        page: chunk.page,
        embedding: embeddings[index],
      }))
    );

    await Document.findByIdAndUpdate(documentId, {
      status: "completed",
      processingStage: null,
      extractedText,
      summary,
    });
    await job.updateProgress(100);

    console.log(`Document processed: ${document.fileName}`);
  },
  { connection }
);

worker.on("failed", async (job, error) => {
  console.error(`Document processing failed (attempt ${job.attemptsMade}/${job.opts.attempts}):`, error);

  const exhausted = job.attemptsMade >= job.opts.attempts;
  if (exhausted) {
    await Document.findByIdAndUpdate(job.data.documentId, {
      status: "failed",
      processingStage: null,
    }).catch(() => {});
  }
});

export default worker;
