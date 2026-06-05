import mongoose from "mongoose";

export interface IHadithBook {
  bible: mongoose.Types.ObjectId;
  book_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  // totalHadith: number;
}

const hadithBookSchema = new mongoose.Schema<IHadithBook>(
  {
    bible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HadithBible",
      required: true,
    },
    book_number: {
      type: Number,
      required: true,
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
    // totalHadith: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
  },
  { timestamps: true },
);

// Each chapter_number is unique within a book
hadithBookSchema.index({ bible: 1, book_number: 1 }, { unique: true });

const HadithBook = mongoose.model<IHadithBook>("HadithBook", hadithBookSchema);

export default HadithBook;
