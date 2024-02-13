"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = (0, redis_1.createClient)({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
exports.default = client;
