import { Request, Response } from "express";
import Ayah from "../models/Ayah";

export const getAllAyahs = async (req: Request, res: Response) => {
  try {
    const ayahs = await Ayah.find();

    if (ayahs.length === 0) {
      return res.status(404).json({
        message: "No Ayah found in the database",
      });
    }
    res.status(200).json({ ayahs });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while getting all ayahs: ${err.message}`,
    });
  }
};

export const addAyah = async (req: Request, res: Response) => {
  try {
    const { surah, ayah_number, text_ar, text_mm } = req.body;
    const newAyah = await Ayah.create({ surah, ayah_number, text_ar, text_mm });
    res.status(201).json({
      message: "New Ayah Added",
      newAyah,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error while adding new ayah: ${(error as Error).message}`,
    });
  }
};

export const getAyahById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ayah = await Ayah.findById(id);
    if (!ayah)
      return res
        .status(404)
        .json({ message: `No ayah found with this id: ${id}` });

    res.status(200).json({ ayah });
  } catch (error) {
    res.status(500).json({
      error: `Error while getting ayah with id: ${(error as Error).message}`,
    });
  }
};

export const updateAyahById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedAyah = await Ayah.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAyah)
      return res.status(404).json({
        message: `No updated ayah`,
      });
    res.status(200).json({
      message: "Ayah updated",
      updatedAyah,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error while updating ayah: ${(error as Error).message}`,
    });
  }
};

export const deleteAyahById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ayah = await Ayah.findById(id);
    if (!ayah)
      return res.status(404).json({
        message: `No ayah found with this ID: ${id}`,
      });
    await Ayah.findByIdAndDelete(id);
    res.status(200).json({
      message: "Ayah deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: `Error while deleting ayah: ${(error as Error).message}`,
    });
  }
};
