import Document from "../models/doc.model.js";
import { searchChunks } from "../services/search.service.js";
import { validateQuestion } from "../utils/validateQuestion.js";

export const search = async (req, res) => {
  try {
    const { documentId, query } = req.body;

    const validationError = validateQuestion(query);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const document = await Document.findOne({ _id: documentId, user: req.userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const results = await searchChunks(documentId, query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};