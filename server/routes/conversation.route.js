import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  listConversations,
  createConversation,
  getConversation,
  deleteConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listConversations);
router.post("/", createConversation);
router.get("/:id", getConversation);
router.delete("/:id", deleteConversation);

export default router;
