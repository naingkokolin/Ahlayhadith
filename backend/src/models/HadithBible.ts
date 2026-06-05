import mongoose, { Document } from "mongoose";

export interface IHadithBible {
  bible_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  // author: string;
  // totalHadith: number;
}

const hadithBibleSchema = new mongoose.Schema<IHadithBible>(
  {
    bible_number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    name_mm: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
    // author: {
    //   type: String,
    //   required: true, // e.g. "Imam Bukhari"
    // },
    // totalHadith: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
  },
  { timestamps: true },
);

const HadithBible = mongoose.model<IHadithBible>(
  "HadithBible",
  hadithBibleSchema,
);
export default HadithBible;
