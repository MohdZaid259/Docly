import rateLimit from "express-rate-limit";

const keyByUser = (req) => req.userId?.toString() || req.ip;

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByUser,
  message: { message: "Too many uploads. Please try again in a few minutes." },
});

export const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByUser,
  message: { message: "Too many requests. Please slow down and try again shortly." },
});
