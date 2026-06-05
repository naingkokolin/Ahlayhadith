import { Request, Response } from "express";
import HadithBook from "../models/HadithBook";

export const getAllHadithBooks = async (req: Request, res: Response) => {
  try {
    const books = await HadithBook.find().sort({ book_number: 1 });
    if (books.length === 0)
      return res
        .status(404)
        .json({ message: "No Hadith Book found in the database!" });

    res.status(200).json({ books });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Hadith Books: ${err.message}` });
  }
};

export const addHadithBook = async (req: Request, res: Response) => {
  try {
    const { bible, book_number, name_ar, name_mm, name_en } = req.body;
    const newBook = await HadithBook.create({
      bible,
      book_number,
      name_ar,
      name_mm,
      name_en,
      // author,
      // totalHadith,
    });
    res.status(201).json({ book: newBook });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while adding new Hadith Book: ${err.message}` });
  }
};

export const getHadithBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await HadithBook.findById(id);
    if (!book)
      return res
        .status(404)
        .json({ message: `No Hadith Book found with this id: ${id}` });

    res.status(200).json({ book });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Hadith Book by id: ${err.message}` });
  }
};

export const updateHadithBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBook = await HadithBook.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBook)
      return res
        .status(404)
        .json({ message: `No Hadith Book found with this id: ${id}!` });

    res.status(200).json({ book: updatedBook });
  } catch (error) {
    res.status(500).json({
      error: `Error while updating Hadith Book: ${(error as Error).message}`,
    });
  }
};

export const deleteHadithBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await HadithBook.findById(id);
    if (!book)
      return res
        .status(404)
        .json({ message: `No Hadith Book found with this ID: ${id}` });

    await HadithBook.findByIdAndDelete(id);
    res.status(200).json({ message: `Hadith Book id: ${id} was deleted.` });
  } catch (error) {
    res.status(500).json({
      error: `Error while deleting Hadith Book: ${(error as Error).message}`,
    });
  }
};
