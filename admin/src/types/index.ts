export interface ISurah {
  _id?: string;
  surah_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  totalAyah: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAyah {
  _id?: string;
  // Mongoose .populate("surah") returns the full ISurah object.
  // Plain create/update returns just the ObjectId string.
  surah: string | ISurah;
  ayah_number: number;
  text_ar: string;
  text_mm: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Safely extract the surah _id regardless of whether it is populated or not */
export const getSurahId = (surah: IAyah["surah"]): string =>
  typeof surah === "string" ? surah : (surah._id ?? "");

export type Page = "dashboard" | "surahs" | "ayahs";
