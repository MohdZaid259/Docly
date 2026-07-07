import IORedis from "ioredis";

const useRedisUrl = Boolean(process.env.REDIS_URL?.trim());
const useTls = process.env.REDIS_TLS === "true";

const connection = useRedisUrl
  ? new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      tls: useTls ? {} : undefined,
    })
  : new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      tls: useTls ? {} : undefined,
      maxRetriesPerRequest: null,
    });

export default connection;

// For Local:
// import IORedis from "ioredis";

// const connection = new IORedis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   maxRetriesPerRequest: null,
// });

// export default connection;