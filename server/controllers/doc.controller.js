import Document from "../models/doc.model.js";
import { uploadToS3, deleteFromS3 } from "../services/s3.service.js";
import { uploadQueue } from "../queues/upload.queue.js";

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please select a file to upload." });
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

    await document.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};