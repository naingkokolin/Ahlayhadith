"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAyahById = exports.updateAyahById = exports.getAyahById = exports.addAyah = exports.getAllAyahs = void 0;
const Ayah_1 = __importDefault(require("../models/Ayah"));
const getAllAyahs = async (req, res) => {
    try {
        const ayahs = await Ayah_1.default.find().populate("surah");
        if (ayahs.length === 0) {
            return res.status(404).json({
                message: "No Ayah found in the database",
            });
        }
        res.status(200).json({ ayahs });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            error: `Error while getting all ayahs: ${err.message}`,
        });
    }
};
exports.getAllAyahs = getAllAyahs;
const addAyah = async (req, res) => {
    try {
        const { surah, ayah_number, text_ar, text_mm } = req.body;
        const newAyah = await Ayah_1.default.create({ surah, ayah_number, text_ar, text_mm });
        res.status(201).json({
            ayah: newAyah,
        });
    }
    catch (error) {
        res.status(500).json({
            error: `Error while adding new ayah: ${error.message}`,
        });
    }
};
exports.addAyah = addAyah;
const getAyahById = async (req, res) => {
    try {
        const { id } = req.params;
        const ayah = await Ayah_1.default.findById(id);
        if (!ayah)
            return res
                .status(404)
                .json({ message: `No ayah found with this id: ${id}` });
        res.status(200).json({ ayah });
    }
    catch (error) {
        res.status(500).json({
            error: `Error while getting ayah with id: ${error.message}`,
        });
    }
};
exports.getAyahById = getAyahById;
const updateAyahById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAyah = await Ayah_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedAyah)
            return res.status(404).json({
                message: `No updated ayah`,
            });
        res.status(200).json({
            ayah: updatedAyah,
        });
    }
    catch (error) {
        res.status(500).json({
            error: `Error while updating ayah: ${error.message}`,
        });
    }
};
exports.updateAyahById = updateAyahById;
const deleteAyahById = async (req, res) => {
    const { id } = req.params;
    try {
        const ayah = await Ayah_1.default.findById(id);
        if (!ayah)
            return res.status(404).json({
                message: `No ayah found with this ID: ${id}`,
            });
        await Ayah_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: "Ayah deleted",
        });
    }
    catch (error) {
        res.status(500).json({
            error: `Error while deleting ayah: ${error.message}`,
        });
    }
};
exports.deleteAyahById = deleteAyahById;
//# sourceMappingURL=ayahControllers.js.map