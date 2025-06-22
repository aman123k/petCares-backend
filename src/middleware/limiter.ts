import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 4, // Max requests per hour
  message: { response: "Too many requests, please try again later." },
  statusCode: 429,
});

export default limiter;
