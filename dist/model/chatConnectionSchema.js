"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatConnectionsModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: String,
    email: String,
    picture: String,
});
const chatConnectionSchema = new mongoose_1.Schema({
    firstUser: { type: userSchema, required: true, trim: true },
    secondUser: { type: userSchema, required: true, trim: true },
    isBlock: { type: String, trim: true },
    lastMessage: { type: String, trim: true },
    time: { type: String, required: true, trim: true },
    userEmail: { type: [String], required: true, trim: true },
});
const ChatConnectionsModel = (0, mongoose_1.model)("chatConnections", chatConnectionSchema);
exports.ChatConnectionsModel = ChatConnectionsModel;
