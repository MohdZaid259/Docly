import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Document from "../models/doc.model.js";

export const listConversations = async (req, res) => {
  try {
    const { documentId, scope } = req.query;
    const filter = { user: req.userId };

    if (documentId) filter.document = documentId;
    if (scope) filter.scope = scope;

    const chats = await Chat.find(filter).sort({ updatedAt: -1 }).limit(50);

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { scope, documentId, documentIds = [] } = req.body;

    if (scope === "document") {
      const document = await Document.findOne({ _id: documentId, user: req.userId });
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const chat = await Chat.create({ user: req.userId, scope, document: documentId });
      return res.status(201).json(chat);
    }

    if (scope === "global") {
      if (documentIds.length > 0) {
        const count = await Document.countDocuments({
          _id: { $in: documentIds },
          user: req.userId,
        });
        if (count !== documentIds.length) {
          return res.status(404).json({ message: "One or more documents not found" });
        }
      }

      const chat = await Chat.create({ user: req.userId, scope, documentIds });
      return res.status(201).json(chat);
    }

    res.status(400).json({ message: "Invalid conversation scope" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.userId });
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 });

    res.json({ chat, messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.userId });
    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await Message.deleteMany({ chat: chat._id });
    await chat.deleteOne();

    res.json({ message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};
