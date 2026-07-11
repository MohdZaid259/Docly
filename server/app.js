import express from "express";
import cors from "cors";

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route.js";
import documentRoutes from "./routes/doc.route.js";
import searchRoutes from "./routes/search.route.js";
import chatRoutes from "./routes/chat.route.js";
import conversationRoutes from "./routes/conversation.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);

export default app;
