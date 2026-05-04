import mongoose, { Schema, Document } from "mongoose";

export interface IAyah extends Document {
  surah: mongoose.Types.ObjectId;
  ayah_number: number;
  text_ar: string;
  text_mm: string;
}

const ayahSchema = new mongoose.Schema<IAyah>(
  {
    surah: {
      type: mongoose.Types.ObjectId,
      ref: "Surah",
      required: true,
    },
    ayah_number: {
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
  },
  { timestamps: true },
);

ayahSchema.index({ text_mm: "text" });
ayahSchema.index({ surah: 1, ayah_number: 1 }, { unique: true });

const Ayah = mongoose.model<IAyah>("Ayah", ayahSchema);
export default Ayah;
