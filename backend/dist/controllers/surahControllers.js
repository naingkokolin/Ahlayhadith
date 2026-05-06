"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSurahById = exports.deleteSurahById = exports.getSurahById = exports.addSurah = exports.getAllSurahs = void 0;
const Surah_1 = __importDefault(require("../models/Surah"));
const getAllSurahs = async (req, res) => {
    try {
        const surahs = await Surah_1.default.find();
        if (surahs.length === 0)
            return res
                .status(404)
                .json({ message: `No Surah Found in the database!` });
        res.status(200).json({ surahs });
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ error: `Error while getting Surahs: ${err.message}` });
    }
};
exports.getAllSurahs = getAllSurahs;
const addSurah = async (req, res) => {
    try {
        const { surah_number, name_ar, name_mm, name_en, totalAyah } = req.body;
        const newSurah = await Surah_1.default.create({
            surah_number,
            name_ar,
            name_mm,
            name_en,
            totalAyah,
        });
        res.status(201).json({
            surah: newSurah,
        });
    }
    catch (error) {
        const err = error;
        res
            .status(500)
            .json({ error: `Error while adding new Surah: ${err.message}` });
    }
};
exports.addSurah = addSurah;
const getSurahById = async (req, res) => {
    const { id } = req.params;
    try {
        const surah = await Surah_1.default.findById(id);
        if (!surah) {
            return res
                .status(404)
                .json({ message: `There is no surah with this id: ${id}` });
        }
        res.status(200).json({ surah });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            error: `Error while getting surah by id: ${err.message}`,
        });
    }
};
exports.getSurahById = getSurahById;
const deleteSurahById = async (req, res) => {
    const { id } = req.params;
    try {
        const surah = await Surah_1.default.findById(id);
        if (!surah)
            return res
                .status(404)
                .json({ message: `No Surah found with this id: ${id}` });
        await Surah_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: `Surah id: ${id} was deleted.` });
    }
    catch (error) {
        res.status(500).json({
            error: `Error while delete surah: ${error.message}`,
        });
    }
};
exports.deleteSurahById = deleteSurahById;
const updateSurahById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSurah = await Surah_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedSurah)
            return res.status(404).json({
                message: `No Surah found with this id: ${id}!`,
            });
        res.status(200).json({
            surah: updatedSurah,
        });
    }
    catch (error) {
        res.status(500).json({
            error: `Error while updating Surah: ${error.message}`,
        });
    }
};
exports.updateSurahById = updateSurahById;
//# sourceMappingURL=surahControllers.js.map