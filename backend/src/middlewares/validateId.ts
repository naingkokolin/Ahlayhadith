import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  // const { id } = req.params;
  const id =
    req.params.id ||
    req.params.bibleId ||
    req.params.bookId ||
    req.params.chapterId ||
    req.params.hadithId;
  if (
    !mongoose.Types.ObjectId.isValid(id as string | mongoose.Types.ObjectId)
  ) {
    return res.status(400).json({
      message: `Invalid ID format`,
    });
  }
  next();
};
