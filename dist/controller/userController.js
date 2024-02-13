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
const userSchema_1 = require("../model/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtTpken_1 = require("../token/jwtTpken");
class userController {
}
_a = userController;
userController.userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, picture, registerType } = req.body;
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield userSchema_1.UserModel.findOne({ email });
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.registerType.length) === 2 ||
                (user === null || user === void 0 ? void 0 : user.registerType[0]) === registerType[0] ||
                (user === null || user === void 0 ? void 0 : user.password) === "") {
                res.status(400).json({
                    success: false,
                    response: `User already exist please login with ${user.loginType}`,
                });
                return;
            }
            else {
                user.registerType.push(registerType[0]);
                yield userSchema_1.UserModel.findByIdAndUpdate(user._id, {
                    registerType: user.registerType,
                });
                res.status(201).json({
                    success: true,
                    response: "User added Successfully",
                });
            }
            return;
        }
        const newUser = new userSchema_1.UserModel({
            username,
            email,
            password: hashPassword,
            picture,
            registerType,
            loginType: "password",
        });
        yield newUser.save();
        res.status(201).json({
            success: true,
            response: "User Register Successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userController.userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userSchema_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                response: "User not found",
            });
            return;
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (user.password === "") {
            res.status(400).json({
                success: false,
                response: `Please login with ${user.loginType}`,
            });
            return;
        }
        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                response: "Invalid password",
            });
            return;
        }
        const accessToken = (0, jwtTpken_1.createToken)(user);
        res.cookie("PetCaresAccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            response: "User logged in successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userController.userLogOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.PetCaresAccessToken;
    const userDetais = (0, jwtTpken_1.verifyToken)(token);
    try {
        if (userDetais) {
            res.clearCookie("PetCaresAccessToken");
            res.status(200).json({
                success: true,
                response: "User logout successfully...",
            });
            return;
        }
    }
    catch (_c) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
exports.default = userController;
