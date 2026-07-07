import { Queue } from "bullmq";
import connection from "../configs/redis.js";

export const uploadQueue = new Queue("document-processing",
    { connection }
  );