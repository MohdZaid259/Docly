import Document from "../models/doc.model.js";
import Chunk from "../models/chunk.model.js";
import { uploadToS3, deleteFromS3, downloadFileFromS3 } from "../services/s3.service.js";
import { uploadQueue } from "../queues/upload.queue.js";

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please select a file to upload." });
    }

    const { replaceId } = req.body;

    if (replaceId) {
      const existing = await Document.findOne({ _id: replaceId, user: req.userId });
      if (!existing) {
        return res.status(404).json({ message: "Document to replace was not found" });
      }

      if (existing.s3Key) {
        await deleteFromS3(existing.s3Key);
      }
      await Chunk.deleteMany({ document: existing._id });

      const { key, fileUrl } = await uploadToS3(file);

      existing.fileName = file.originalname;
      existing.s3Key = key;
      existing.s3Url = fileUrl;
      existing.mimeType = file.mimetype;
      existing.size = file.size;
      existing.status = "uploaded";
      existing.summary = null;
      existing.extractedText = null;
      await existing.save();

      await uploadQueue.add("process-document", { documentId: existing._id });

      return res.status(200).json(existing);
    }

    const duplicate = await Document.findOne({ user: req.userId, fileName: file.originalname });
    if (duplicate) {
      return res.status(409).json({
        message: "A document with this name already exists.",
        existingDocument: duplicate,
      });
    }

    const { key, fileUrl } = await uploadToS3(file);

    const document = await Document.create({
      user: req.userId,
      fileName: file.originalname,
      s3Key: key,
      s3Url: fileUrl,
      mimeType: file.mimetype,
      size: file.size,
    });

    await uploadQueue.add("process-document", { documentId: document._id });

    res.status(201).json(document);
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      message: error?.message || "Upload failed",
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.userId }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

export const getDocumentFile = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const buffer = await downloadFileFromS3(document.s3Key);

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${document.fileName}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Failed to load document file" });
  }
};

export const togglePin = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.pinned = !document.pinned;
    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to update document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.s3Key) {
      await deleteFromS3(document.s3Key);
    }

    await Chunk.deleteMany({ document: document._id });
    await document.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};