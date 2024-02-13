"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, trim: true },
    picture: { type: String, trim: true },
    registerType: { type: [String], trim: true, required: true },
    loginType: { type: String, trim: true, required: true },
});
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.UserModel = UserModel;
