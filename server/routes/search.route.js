import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { search } from "../controllers/search.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", search);

export default router;