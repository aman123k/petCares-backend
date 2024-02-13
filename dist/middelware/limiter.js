"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    max: 4, // Max requests per hour
    message: { response: "Too many requests, please try again later." },
    statusCode: 429,
});
exports.default = limiter;
