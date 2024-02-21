"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetListModel = void 0;
const mongoose_1 = require("mongoose");
const petlistSchema = new mongoose_1.Schema({
    petType: { type: String, required: true, trim: true },
    petImage: { type: [String], required: true, unique: true, trim: true },
    petStory: { type: String, trim: true },
    reason: { type: String, trim: true },
    time: { type: String, trim: true, required: true },
    characteristics: { type: Object, trim: true, required: true },
    keyFact: { type: Object, trim: true, required: true },
    Auth: { type: Object, trim: true, required: true },
    Favourites: { type: [String], trim: true },
});
const PetListModel = (0, mongoose_1.model)("PetList", petlistSchema);
exports.PetListModel = PetListModel;
