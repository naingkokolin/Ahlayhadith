import mongoose, { Document } from "mongoose";

export interface IHadith extends Document {
  book: mongoose.Types.ObjectId;
  chapter: mongoose.Types.ObjectId;
  hadith_number: number;
  text_ar: string;
  text_mm: string;
  grade: string; // e.g. "Sahih", "Hasan", "Da'if"
}

const hadithSchema = new mongoose.Schema<IHadith>(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HadithBook",
      required: true,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HadithChapter",
      required: true,
    },
    hadith_number: {
      type: Number,
      required: true,
    },
    text_ar: {
      type: String,
      required: true,
    },
    text_mm: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: false,
      default: "Sahih",
    },
  },
  { timestamps: true }
);

// Full-text search on myanmar translation
hadithSchema.index({ text_mm: "text" });
// Each hadith_number unique within a book
hadithSchema.index({ book: 1, hadith_number: 1 }, { unique: true });
hadithSchema.index({ chapter: 1 });

const Hadith = mongoose.model<IHadith>("Hadith", hadithSchema);
export default Hadith;
