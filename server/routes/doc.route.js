import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadDocument, getDocuments, deleteDocument, getDocumentById, getDocumentFile, togglePin } from "../controllers/doc.controller.js";

const router = express.Router();

router.use(authMiddleware);

const handleUploadError = (req, res, next) => {
  upload.single("document")(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || "Invalid file upload." });
    }
    next();
  });
};

router.get("/", getDocuments);
router.post("/upload", handleUploadError, uploadDocument);
router.get("/:id", getDocumentById);
router.get("/:id/file", getDocumentFile);
router.patch("/:id/pin", togglePin);
router.delete("/:id", deleteDocument);

export default router;