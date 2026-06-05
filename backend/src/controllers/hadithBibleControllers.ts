import { Request, Response } from "express";
import HadithBible from "../models/HadithBible";

export const getAllHadithBibles = async (req: Request, res: Response) => {
  try {
    const bibles = await HadithBible.find().sort({ bible_number: 1 });
    if (bibles.length === 0)
      return res
        .status(404)
        .json({ message: "No Hadith Bible found in the database!" });

    res.status(200).json({ bibles });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Hadith Bibles: ${err.message}` });
  }
};

export const addHadithBible = async (req: Request, res: Response) => {
  try {
    const { bible_number, name_ar, name_mm, name_en } = req.body;
    const newBible = await HadithBible.create({
      bible_number,
      name_ar,
      name_mm,
      name_en,
      // author,
      // totalHadith,
    });
    res.status(201).json({ bible: newBible });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while adding new Hadith Bible: ${err.message}` });
  }
};

export const getHadithBibleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const bible = await HadithBible.findById(id);
    if (!bible)
      return res
        .status(404)
        .json({ message: `No Hadith Bible found with this id: ${id}` });

    res.status(200).json({ bible });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while getting Hadith Bible by id: ${err.message}`,
    });
  }
};

export const updateHadithBibleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBible = await HadithBible.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBible)
      return res
        .status(404)
        .json({ message: `No Hadith Bible found with this id: ${id}!` });

    res.status(200).json({ bible: updatedBible });
  } catch (error) {
    res.status(500).json({
      error: `Error while updating Hadith Bible: ${(error as Error).message}`,
    });
  }
};

export const deleteHadithBibleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const bible = await HadithBible.findById(id);
    if (!bible)
      return res
        .status(404)
        .json({ message: `No Hadith Bible found with this ID: ${id}` });

    await HadithBible.findByIdAndDelete(id);
    res.status(200).json({ message: `Hadith Bible id: ${id} was deleted.` });
  } catch (error) {
    res.status(500).json({
      error: `Error while deleting Hadith Bible: ${(error as Error).message}`,
    });
  }
};
