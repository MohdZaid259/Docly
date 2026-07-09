import Document from "../models/doc.model.js";
import { askQuestion, streamQuestion } from "../services/chat.service.js";

export const chat = async (req, res) => {
  try {
    const { documentId, question, messages=[] } = req.body;

    const document = await Document.findOne({ _id: documentId, user: req.userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const result = await askQuestion(documentId, question, messages);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message })
  }
};

export const streamChat = async (req, res) => {
  try {
    const { documentId, question, messages = [] } = req.body;

    const document = await Document.findOne({ _id: documentId, user: req.userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await streamQuestion(documentId, question, messages);
    if (!result.stream) {
      res.write(`data: ${JSON.stringify({ token: result.answer })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, sources: result.sources })}\n\n`);
      return res.end();
    }

    for await (const chunk of result.stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (!token) continue;

      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true, sources: result.sources })}\n\n`);
    res.end();
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ done: true, error: error.message })}\n\n`);
    res.end();
  }
};