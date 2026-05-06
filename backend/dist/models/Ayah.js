"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ayahSchema = new mongoose_1.default.Schema({
    surah: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Surah",
        required: true,
    },
    ayah_number: {
        type: Number,
        required: true,
    },
    text_ar: {
        type: String,
        required: true,
    },
    text_mm: {
        type: String,
        required: true,
    },
}, { timestamps: true });
ayahSchema.index({ text_mm: "text" });
ayahSchema.index({ surah: 1, ayah_number: 1 }, { unique: true });
const Ayah = mongoose_1.default.model("Ayah", ayahSchema);
exports.default = Ayah;
//# sourceMappingURL=Ayah.js.map