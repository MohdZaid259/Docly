import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route.js";
import documentRoutes from "./routes/doc.route.js";
import searchRoutes from "./routes/search.route.js";
import chatRoutes from "./routes/chat.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);

export default app;
