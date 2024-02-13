"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secreteKey = String(process.env.SecreteKey);
const createToken = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ user }, secreteKey);
    return accessToken;
};
exports.createToken = createToken;
const verifyToken = (token) => {
    if (!token)
        return null;
    try {
        const userDetais = jsonwebtoken_1.default.verify(token, secreteKey);
        return userDetais;
    }
    catch (_a) {
        return null;
    }
};
exports.verifyToken = verifyToken;
