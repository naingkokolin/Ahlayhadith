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
