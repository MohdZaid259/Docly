import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chat, streamChat, streamGlobalChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", chat);
router.post("/stream", streamChat);
router.post("/global/stream", streamGlobalChat);

export default router;