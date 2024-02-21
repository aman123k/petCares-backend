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
const uploader_1 = __importDefault(require("../cloudinary/uploader"));
const listSchema_1 = require("../model/listSchema");
const jwtTpken_1 = require("../token/jwtTpken");
class AddPetController {
}
_a = AddPetController;
AddPetController.ListPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { pet, characteristics, reason, time, keyFact, petImage, petStory } = req.body;
    const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.PetCaresAccessToken;
    const userDetails = (0, jwtTpken_1.verifyToken)(token);
    const promises = petImage === null || petImage === void 0 ? void 0 : petImage.map((image) => (0, uploader_1.default)(image));
    const uploadedImages = yield Promise.all(promises);
    const petData = new listSchema_1.PetListModel({
        petType: pet,
        petImage: uploadedImages,
        petStory,
        reason,
        time,
        characteristics,
        keyFact,
        Auth: {
            email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.user.email,
            name: (_c = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _c === void 0 ? void 0 : _c.username,
        },
    });
    yield petData.save();
    res.status(200).json({
        success: true,
        response: "Your pet listing has been submitted. Admin approval pending. Thanks!",
    });
    try {
    }
    catch (_d) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
AddPetController.AddFavourites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    try {
        const { id } = req.body;
        const token = (_e = req.cookies) === null || _e === void 0 ? void 0 : _e.PetCaresAccessToken;
        const userDetais = (0, jwtTpken_1.verifyToken)(token);
        if (!userDetais) {
            res.status(400).json({
                success: false,
                response: "Please login to add",
            });
            return;
        }
        const docs = yield listSchema_1.PetListModel.findOne({ _id: id });
        if (docs) {
            if (!(docs === null || docs === void 0 ? void 0 : docs.Favourites.includes((_f = userDetais === null || userDetais === void 0 ? void 0 : userDetais.user) === null || _f === void 0 ? void 0 : _f.email))) {
                docs.Favourites.push((_g = userDetais === null || userDetais === void 0 ? void 0 : userDetais.user) === null || _g === void 0 ? void 0 : _g.email);
                yield docs.save();
                res.status(200).json({
                    success: true,
                    response: "Pet added in favorite your list",
                });
                return;
            }
            else {
                const newdocs = docs.Favourites.filter((favourites) => {
                    var _b;
                    return favourites !== ((_b = userDetais === null || userDetais === void 0 ? void 0 : userDetais.user) === null || _b === void 0 ? void 0 : _b.email);
                });
                docs.Favourites = newdocs;
                yield docs.save();
                res.status(200).json({
                    success: true,
                    response: "Pet removed  from your favorite list ",
                });
            }
        }
    }
    catch (_h) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
exports.default = AddPetController;
