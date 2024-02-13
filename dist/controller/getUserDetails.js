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
const jwtTpken_1 = require("../token/jwtTpken");
const userSchema_1 = require("../model/userSchema");
const uploader_1 = __importDefault(require("../cloudinary/uploader"));
const deleteImage_1 = __importDefault(require("../cloudinary/deleteImage"));
class userDetails {
}
_a = userDetails;
userDetails.getUserFun = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.PetCaresAccessToken;
    const userDetails = (0, jwtTpken_1.verifyToken)(token);
    const user = yield userSchema_1.UserModel.findOne({ email: (_c = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _c === void 0 ? void 0 : _c.email });
    try {
        if (user === null) {
            res.status(400).json({
                success: false,
                response: "user not login.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            response: user,
        });
    }
    catch (_d) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
userDetails.getUserUpda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    try {
        const { image, userName } = req.body;
        const token = (_e = req.cookies) === null || _e === void 0 ? void 0 : _e.PetCaresAccessToken;
        const userDetails = (0, jwtTpken_1.verifyToken)(token);
        const userDet = yield userSchema_1.UserModel.findOne({
            email: (_f = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _f === void 0 ? void 0 : _f.email,
        });
        const id = userDet === null || userDet === void 0 ? void 0 : userDet._id;
        if (image) {
            yield (0, deleteImage_1.default)((_g = userDet === null || userDet === void 0 ? void 0 : userDet.picture) !== null && _g !== void 0 ? _g : "");
            const response = yield (0, uploader_1.default)(image);
            const user = yield userSchema_1.UserModel.findByIdAndUpdate(id, {
                picture: response,
                username: userName,
            }, { options: true });
            console.log(user);
            yield (user === null || user === void 0 ? void 0 : user.save());
        }
        else {
            const user = yield userSchema_1.UserModel.findByIdAndUpdate(id, {
                username: userName,
            }, { options: true });
            yield (user === null || user === void 0 ? void 0 : user.save());
        }
        res.status(200).json({
            success: true,
            response: "Profile updated sucessfully..",
        });
    }
    catch (_h) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
exports.default = userDetails;
