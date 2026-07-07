import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route.js";
import documentRoutes from "./routes/doc.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

export default app;
