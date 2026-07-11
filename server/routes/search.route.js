import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatLimiter } from "../middlewares/rateLimit.middleware.js";
import { search } from "../controllers/search.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(chatLimiter);

router.post("/", search);

export default router;