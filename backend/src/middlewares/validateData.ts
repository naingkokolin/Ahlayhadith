import { Request, Response, NextFunction } from "express";

export const validateSurah = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { surah_number, name_ar, name_mm, name_en, totalAyah } = req.body;
  if (!surah_number || !name_ar || !name_en || !name_mm || !totalAyah) {
    return res.status(400).json({
      message: "All fileds are required!",
    });
  }
  if (
    typeof surah_number !== "number" ||
    typeof totalAyah !== "number" ||
    surah_number <= 0 ||
    totalAyah <= 0
  ) {
    return res.status(400).json({
      message: "Number or Total Ayah must be positive integer",
    });
  }
  next();
};

export const validateAyah = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { surah, ayah_number, text_ar, text_mm } = req.body;
  if (!surah || !ayah_number || !text_ar || !text_mm) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }
  if (typeof ayah_number !== "number" || ayah_number <= 0) {
    return res.status(400).json({
      message: "Number must be positive integer",
    });
  }
  next();
};

export const validateHadithBook = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { book_number, name_ar, name_mm, name_en } = req.body;
  if (
    !book_number ||
    !name_ar ||
    !name_mm ||
    !name_en
    // !author ||
    // !totalHadith
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  if (
    typeof book_number !== "number" ||
    // typeof totalHadith !== "number" ||
    book_number <= 0
    // totalHadith <= 0
  ) {
    return res.status(400).json({
      message: "book_number must be positive integer",
    });
  }
  next();
};

export const validateHadithChapter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { book, chapter_number, name_ar, name_mm, name_en, totalHadith } =
    req.body;
  if (
    !book ||
    !chapter_number ||
    !name_ar ||
    !name_mm ||
    !name_en ||
    !totalHadith
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  if (
    typeof chapter_number !== "number" ||
    typeof totalHadith !== "number" ||
    chapter_number <= 0 ||
    totalHadith <= 0
  ) {
    return res.status(400).json({
      message: "chapter_number and totalHadith must be positive integers",
    });
  }
  next();
};

export const validateHadith = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { book, chapter, hadith_number, text_ar, text_mm } = req.body;
  if (!book || !chapter || !hadith_number || !text_ar || !text_mm) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  if (typeof hadith_number !== "number" || hadith_number <= 0) {
    return res
      .status(400)
      .json({ message: "hadith_number must be a positive integer" });
  }
  next();
};
