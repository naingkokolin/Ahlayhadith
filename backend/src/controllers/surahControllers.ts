import { Request, Response } from "express";
import Surah from "../models/Surah";

export const getAllSurahs = async (req: Request, res: Response) => {
  try {
    const surahs = await Surah.find();
    if (surahs.length === 0)
      return res
        .status(404)
        .json({ message: `No Surah Found in the database!` });

    res.status(200).json({ surahs });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Surahs: ${err.message}` });
  }
};

export const addSurah = async (req: Request, res: Response) => {
  try {
    const { surah_number, name_ar, name_mm, name_en, totalAyah } = req.body;
    const newSurah = await Surah.create({
      surah_number,
      name_ar,
      name_mm,
      name_en,
      totalAyah,
    });

    res.status(201).json({
      message: "New Surah added Successfully",
      surah: newSurah,
    });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while adding new Surah: ${err.message}` });
  }
};

export const getSurahById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const surah = await Surah.findById(id);
    if (!surah) {
      return res
        .status(404)
        .json({ message: `There is no surah with this id: ${id}` });
    }

    res.status(200).json({ surah });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while getting surah by id: ${err.message}`,
    });
  }
};

export const deleteSurahById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const surah = await Surah.findById(id);
    if (!surah)
      return res
        .status(404)
        .json({ message: `No Surah found with this id: ${id}` });

    await Surah.findByIdAndDelete(id);
    res.status(200).json({ message: `Surah id: ${id} was deleted.` });
  } catch (error) {
    res.status(500).json({
      error: `Error while delete surah: ${(error as Error).message}`,
    });
  }
};

export const updateSurahById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedSurah = await Surah.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSurah)
      return res.status(404).json({
        message: `No Surah found with this id: ${id}!`,
      });
    res.status(200).json({
      message: "Surah updated",
      updatedSurah,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error while updating Surah: ${(error as Error).message}`,
    });
  }
};
