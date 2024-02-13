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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const userSchema_1 = require("../model/userSchema");
const jwtTpken_1 = require("../token/jwtTpken");
class authFile {
}
_a = authFile;
authFile.googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { tokenResponse, registerType } = req.body;
        const response = yield (0, cross_fetch_1.default)(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse}`);
        const result = yield response.json();
        const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.PetCaresAccessToken;
        const user = yield userSchema_1.UserModel.findOne({ email: result === null || result === void 0 ? void 0 : result.email });
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.loginType) !== "google") {
                res.status(400).json({
                    success: false,
                    response: `User already exist please login with ${user.loginType}`,
                });
                return;
            }
            else if ((user === null || user === void 0 ? void 0 : user.registerType.length) !== 2 &&
                (user === null || user === void 0 ? void 0 : user.registerType[0]) !== registerType[0]) {
                user.registerType.push(registerType[0]);
                const accessToken = (0, jwtTpken_1.createToken)({
                    username: user === null || user === void 0 ? void 0 : user.username,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    password: user === null || user === void 0 ? void 0 : user.password,
                    picture: user === null || user === void 0 ? void 0 : user.picture,
                    registerType: user === null || user === void 0 ? void 0 : user.registerType,
                    loginType: user === null || user === void 0 ? void 0 : user.loginType,
                });
                res.cookie("PetCaresAccessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    sameSite: "none",
                });
                yield userSchema_1.UserModel.findByIdAndUpdate(user._id, {
                    registerType: user.registerType,
                });
                res.status(201).json({
                    success: true,
                    response: "User added Successfully",
                });
            }
            else {
                const accessToken = (0, jwtTpken_1.createToken)({
                    username: user === null || user === void 0 ? void 0 : user.username,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    password: user === null || user === void 0 ? void 0 : user.password,
                    picture: user === null || user === void 0 ? void 0 : user.picture,
                    registerType: user === null || user === void 0 ? void 0 : user.registerType,
                    loginType: user === null || user === void 0 ? void 0 : user.loginType,
                });
                res.cookie("PetCaresAccessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    sameSite: "none",
                });
                res.status(201).json({
                    success: true,
                    response: "User Login Successfully",
                });
            }
            return;
        }
        const accessToken = (0, jwtTpken_1.createToken)({
            username: result === null || result === void 0 ? void 0 : result.name,
            email: result === null || result === void 0 ? void 0 : result.email,
            password: " ",
            picture: result === null || result === void 0 ? void 0 : result.picture,
            registerType,
            loginType: "google",
        });
        res.cookie("PetCaresAccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "none",
        });
        const newUser = new userSchema_1.UserModel({
            username: result === null || result === void 0 ? void 0 : result.name,
            email: result === null || result === void 0 ? void 0 : result.email,
            password: " ",
            picture: result === null || result === void 0 ? void 0 : result.picture,
            registerType,
            loginType: "google",
        });
        yield newUser.save();
        res.status(201).json({
            success: true,
            response: "User Register Successfully",
        });
    }
    catch (_c) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
exports.default = authFile;
