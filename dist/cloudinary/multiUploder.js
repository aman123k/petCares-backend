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
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
cloudinary_1.v2.config({
    cloud_name: String(process.env.CLOUD_NAME),
    api_key: String(process.env.CLOUD_KEY),
    api_secret: String(process.env.CLOUD_SECRET),
});
const multiImageUpload = (image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const multiImageUrl = image.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield cloudinary_1.v2.uploader.upload(image, {
                upload_preset: "petCares",
            });
            return response.url;
        }));
        return yield multiImageUrl;
    }
    catch (_a) {
        console.log("error");
    }
});
exports.default = multiImageUpload;
