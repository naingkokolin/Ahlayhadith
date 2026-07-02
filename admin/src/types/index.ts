// ─── Quran ────────────────────────────────────────────────────

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

/** Safely extract the surah _id regardless of whether it is populated */
export const getSurahId = (surah: IAyah["surah"]): string =>
  typeof surah === "string" ? surah : (surah._id ?? "");

// ─── Hadith ───────────────────────────────────────────────────

export interface IHadithBible {
  _id?: string;
  bible_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHadithBook {
  _id?: string;
  bible: string | IHadithBible;
  book_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  // author: string;
  // totalHadith: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHadithChapter {
  _id?: string;
  // populated by Mongoose → can be full IHadithBook object or string id
  // bible: string | IHadithBible;
  book: string | IHadithBook;
  chapter_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  totalHadith: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHadith {
  _id?: string;
  // both populated by Mongoose
  // bible: string | IHadithBible;
  book: string | IHadithBook;
  chapter: string | IHadithChapter;
  hadith_number: number;
  text_ar: string;
  text_mm: string;
  grade: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Safely extract _id from a possibly-populated ref field */
// export const getRefId = (ref: string | { _id?: string }): string =>
//   typeof ref === "string" ? ref : (ref._id ?? "");

export const getRefId = (
  ref: string | { _id?: string } | null | undefined,
): string => (!ref ? "" : typeof ref === "string" ? ref : (ref._id ?? ""));

// ─── Navigation ───────────────────────────────────────────────

export type Page =
  | "dashboard"
  | "surahs"
  | "ayahs"
  | "hadith-bibles"
  | "hadith-books"
  | "hadith-chapters"
  | "hadiths";
