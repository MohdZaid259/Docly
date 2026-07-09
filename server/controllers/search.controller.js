import { searchChunks } from "../services/search.service.js";

export const search = async (req, res) => {
  try {
    const { documentId, query } = req.body;

    const results = await searchChunks(documentId, query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};