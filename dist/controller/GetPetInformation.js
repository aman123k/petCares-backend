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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const listSchema_1 = require("../model/listSchema");
const jwtTpken_1 = require("../token/jwtTpken");
class GetPetInformation {
}
_a = GetPetInformation;
GetPetInformation.GetPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const PetData = yield listSchema_1.PetListModel.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const totalDoc = yield listSchema_1.PetListModel.countDocuments();
        res.status(200).json({
            success: true,
            response: PetData,
            totalDoc,
        });
    }
    catch (_b) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
GetPetInformation.GetFavouritesPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const token = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.PetCaresAccessToken;
        const userDetails = (0, jwtTpken_1.verifyToken)(token);
        const favoritePets = yield listSchema_1.PetListModel.find({
            Favourites: (_d = userDetails === null || userDetails === void 0 ? void 0 : userDetails.user) === null || _d === void 0 ? void 0 : _d.email,
        });
        res.status(200).json({
            success: true,
            response: favoritePets,
        });
    }
    catch (_e) {
        res.status(500).json({
            success: false,
            response: "Server error",
        });
    }
});
exports.default = GetPetInformation;
