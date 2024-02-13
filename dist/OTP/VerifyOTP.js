"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../model/userSchema");
const redisConnect_1 = __importDefault(require("../redis/redisConnect"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtTpken_1 = require("../token/jwtTpken");
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPass, otp } = req.body;
    try {
        const value = yield redisConnect_1.default.get("OTP");
        if (!otp || value !== otp) {
            return res.status(404).json({
                success: false,
                response: "Enter correct OTP...",
            });
        }
        const user = yield userSchema_1.UserModel.findOne({ email });
        const hashPassword = yield bcrypt_1.default.hash(newPass, 10);
        const id = user === null || user === void 0 ? void 0 : user._id;
        const updatePass = yield userSchema_1.UserModel.findByIdAndUpdate(id, { password: hashPassword }, { option: true });
        yield (updatePass === null || updatePass === void 0 ? void 0 : updatePass.save());
        const accessToken = (0, jwtTpken_1.createToken)({
            username: user === null || user === void 0 ? void 0 : user.username,
            email: email,
            password: hashPassword,
            picture: user === null || user === void 0 ? void 0 : user.picture,
            registerType: user === null || user === void 0 ? void 0 : user.registerType,
            loginType: "password",
        });
        res.cookie("PetCaresAccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            response: "Password updated successfully...",
        });
    }
    catch (_a) {
        res.status(400).json({
            success: false,
            response: "Server Error",
        });
    }
});
exports.default = verifyOTP;
