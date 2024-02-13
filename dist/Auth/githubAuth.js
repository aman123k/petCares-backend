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
const dotenv_1 = require("dotenv");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const userSchema_1 = require("../model/userSchema");
const jwtTpken_1 = require("../token/jwtTpken");
(0, dotenv_1.config)();
class AuthFile {
}
_a = AuthFile;
AuthFile.githubAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { tokenResponse } = req.body;
        const response = yield (0, cross_fetch_1.default)("https://github.com/login/oauth/access_token", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_KEY,
                code: tokenResponse,
            }),
        });
        const data = yield response.json();
        const GithubAccessToken = data.access_token;
        const userDetailsResponse = yield (0, cross_fetch_1.default)("https://api.github.com/user", {
            headers: {
                Authorization: `token ${GithubAccessToken}`,
            },
        });
        const userDetails = yield userDetailsResponse.json();
        const user = yield userSchema_1.UserModel.findOne({ email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email });
        const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.PetCaresAccessToken;
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.loginType) !== "github") {
                res.status(400).json({
                    success: false,
                    response: `User already exist please login with ${user.loginType}`,
                });
                return;
            }
            else if ((user === null || user === void 0 ? void 0 : user.registerType.length) !== 2 &&
                (user === null || user === void 0 ? void 0 : user.registerType[0]) !== "rehouser") {
                user.registerType.push("rehouser");
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
            username: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
            email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email,
            password: " ",
            picture: userDetails === null || userDetails === void 0 ? void 0 : userDetails.avatar_url,
            registerType: ["adopter"],
            loginType: "github",
        });
        res.cookie("PetCaresAccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "none",
        });
        const newUser = new userSchema_1.UserModel({
            username: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
            email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email,
            password: " ",
            picture: userDetails === null || userDetails === void 0 ? void 0 : userDetails.avatar_url,
            registerType: ["adopter"],
            loginType: "github",
        });
        yield newUser.save();
        res.status(201).json({
            success: true,
            response: "User Register Successfully",
        });
    }
    catch (_c) {
        console.log("error");
    }
});
exports.default = AuthFile;
