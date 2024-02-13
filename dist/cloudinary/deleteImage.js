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
const ImageDete = (image) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(image);
    const splitImage = image.split("/")[image.split("/").length - 1];
    const ImageName = splitImage.split(".")[0];
    try {
        yield cloudinary_1.v2.uploader.destroy(ImageName);
    }
    catch (_a) {
        console.log("error");
    }
});
exports.default = ImageDete;
