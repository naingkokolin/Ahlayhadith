import mongoose, { Document } from "mongoose";

export interface ISurah extends Document {
  surah_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  totalAyah: number;
}

const surahSchema = new mongoose.Schema<ISurah>(
  {
    surah_number: {
      type: Number,
      required: true,
      index: true,
      unique: true,
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
    totalAyah: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Surah = mongoose.model<ISurah>("Surah", surahSchema);
export default Surah;
