import express from "express";
import { googleLogin, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/google", googleLogin);
router.get("/me", authMiddleware, getMe);

export default router;
