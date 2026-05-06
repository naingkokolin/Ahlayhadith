"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const surahSchema = new mongoose_1.default.Schema({
    surah_number: {
        type: Number,
        required: true,
        index: true,
        unique: true,
    },
    name_ar: {
        type: String,
        required: true,
    },
    name_mm: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true,
    },
    totalAyah: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Surah = mongoose_1.default.model("Surah", surahSchema);
exports.default = Surah;
//# sourceMappingURL=Surah.js.map