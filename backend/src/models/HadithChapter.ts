import mongoose from "mongoose";

export interface IHadithChapter {
  // bible: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  chapter_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  totalHadith: number;
}

const hadithChapterSchema = new mongoose.Schema<IHadithChapter>(
  {
    // bible: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "HadithBible",
    //   required: true,
    // },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HadithBook",
      required: true,
    },
    chapter_number: {
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
      required: false, // may be blank
      default: null,
    },
    totalHadith: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

// Each chapter_number is unique within a book
hadithChapterSchema.index(
  { bible: 1, book: 1, chapter_number: 1 },
  { unique: true },
);

const HadithChapter = mongoose.model<IHadithChapter>(
  "HadithChapter",
  hadithChapterSchema,
);
export default HadithChapter;
