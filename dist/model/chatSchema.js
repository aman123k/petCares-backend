"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    chatId: { type: String, required: true, trim: true },
    sender: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
});
const messagesModel = (0, mongoose_1.model)("messages", chatSchema);
exports.messagesModel = messagesModel;
