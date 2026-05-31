import { Request, Response } from "express";
import HadithChapter from "../models/HadithChapter";

export const getAllHadithChapters = async (req: Request, res: Response) => {
  try {
    const chapters = await HadithChapter.find()
      .populate("book")
      .sort({ chapter_number: 1 });
    if (chapters.length === 0)
      return res
        .status(404)
        .json({ message: "No Hadith Chapter found in the database!" });

    res.status(200).json({ chapters });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Hadith Chapters: ${err.message}` });
  }
};

export const getChaptersByBookId = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  try {
    const chapters = await HadithChapter.find({ book: bookId as string }).sort({
      chapter_number: 1,
    });
    if (chapters.length === 0)
      return res.status(404).json({
        message: `No chapters found for book id: ${bookId}`,
      });

    res.status(200).json({ chapters });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while getting chapters by book id: ${err.message}`,
    });
  }
};

export const addHadithChapter = async (req: Request, res: Response) => {
  try {
    const { book, chapter_number, name_ar, name_mm, name_en, totalHadith } =
      req.body;
    const newChapter = await HadithChapter.create({
      book,
      chapter_number,
      name_ar,
      name_mm,
      name_en,
      totalHadith,
    });
    res.status(201).json({ chapter: newChapter });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while adding new Hadith Chapter: ${err.message}`,
    });
  }
};

export const getHadithChapterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chapter = await HadithChapter.findById(id).populate("book");
    if (!chapter)
      return res
        .status(404)
        .json({ message: `No Hadith Chapter found with this id: ${id}` });

    res.status(200).json({ chapter });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while getting Hadith Chapter by id: ${err.message}`,
    });
  }
};

export const updateHadithChapterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedChapter = await HadithChapter.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedChapter)
      return res
        .status(404)
        .json({ message: `No Hadith Chapter found with this id: ${id}!` });

    res.status(200).json({ chapter: updatedChapter });
  } catch (error) {
    res.status(500).json({
      error: `Error while updating Hadith Chapter: ${(error as Error).message}`,
    });
  }
};

export const deleteHadithChapterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chapter = await HadithChapter.findById(id);
    if (!chapter)
      return res
        .status(404)
        .json({ message: `No Hadith Chapter found with this ID: ${id}` });

    await HadithChapter.findByIdAndDelete(id);
    res.status(200).json({ message: `Hadith Chapter id: ${id} was deleted.` });
  } catch (error) {
    res.status(500).json({
      error: `Error while deleting Hadith Chapter: ${(error as Error).message}`,
    });
  }
};
