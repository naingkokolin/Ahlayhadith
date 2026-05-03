import mongoose, { Schema, Document } from "mongoose";

export interface IAyah extends Document {
  surah: Schema.Types.ObjectId;
  ayah_number: number;
  text_ar: string;
  text_mm: string;
}

const ayahSchema = new mongoose.Schema<IAyah>(
  {
    surah: {
      type: Schema.Types.ObjectId,
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

ayahSchema.index({ surah: 1, number: 1 });
ayahSchema.index({ text_mm: "text" });

const Ayah = mongoose.model<IAyah>("Ayah", ayahSchema);
export default Ayah;
