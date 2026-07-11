import Document from "../models/doc.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { askQuestion, streamQuestion, streamGlobalQuestion } from "../services/chat.service.js";

const toCitations = (sources, document) =>
  sources.map((source) => ({
    document: source.document ?? document?._id,
    fileName: source.fileName ?? document?.fileName,
    page: source.page ?? null,
    text: source.text,
    score: source.score,
  }));

const saveTurn = async ({ chatId, userId, question, answer, sources, document }) => {
  if (!chatId) return;

  const chat = await Chat.findOne({ _id: chatId, user: userId });
  if (!chat) return;

  await Message.create({ chat: chat._id, role: "user", content: question });
  await Message.create({
    chat: chat._id,
    role: "assistant",
    content: answer,
    citations: toCitations(sources, document),
  });

  if (!chat.title) {
    chat.title = question.slice(0, 60);
    await chat.save();
  }
};

export const chat = async (req, res) => {
  try {
    const { documentId, question, messages = [], chatId } = req.body;

    const document = await Document.findOne({ _id: documentId, user: req.userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const result = await askQuestion(documentId, question, messages);

    await saveTurn({
      chatId,
      userId: req.userId,
      question,
      answer: result.answer,
      sources: result.sources,
      document,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message })
  }
};

export const streamChat = async (req, res) => {
  try {
    const { documentId, question, messages = [], chatId } = req.body;

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

      await saveTurn({
        chatId,
        userId: req.userId,
        question,
        answer: result.answer,
        sources: result.sources,
        document,
      });

      return res.end();
    }

    let fullAnswer = "";
    for await (const chunk of result.stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (!token) continue;

      fullAnswer += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true, sources: result.sources })}\n\n`);
    res.end();

    await saveTurn({
      chatId,
      userId: req.userId,
      question,
      answer: fullAnswer,
      sources: result.sources,
      document,
    });
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ done: true, error: error.message })}\n\n`);
    res.end();
  }
};

export const streamGlobalChat = async (req, res) => {
  try {
    const { documentIds = [], question, messages = [], chatId } = req.body;

    let resolvedIds = documentIds;
    if (resolvedIds.length > 0) {
      const count = await Document.countDocuments({
        _id: { $in: resolvedIds },
        user: req.userId,
      });
      if (count !== resolvedIds.length) {
        return res.status(404).json({ message: "One or more documents not found" });
      }
    } else {
      const documents = await Document.find({ user: req.userId }).select("_id");
      resolvedIds = documents.map((doc) => doc._id);
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await streamGlobalQuestion(resolvedIds, question, messages);

    if (!result.stream) {
      res.write(`data: ${JSON.stringify({ token: result.answer })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, sources: result.sources })}\n\n`);

      await saveTurn({
        chatId,
        userId: req.userId,
        question,
        answer: result.answer,
        sources: result.sources,
      });

      return res.end();
    }

    let fullAnswer = "";
    for await (const chunk of result.stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (!token) continue;

      fullAnswer += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true, sources: result.sources })}\n\n`);
    res.end();

    await saveTurn({
      chatId,
      userId: req.userId,
      question,
      answer: fullAnswer,
      sources: result.sources,
    });
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ done: true, error: error.message })}\n\n`);
    res.end();
  }
};
