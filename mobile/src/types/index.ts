// ─── Quran ────────────────────────────────────────────────────────────────────

export interface Surah {
  _id: string;
  surah_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  totalAyah: number;
}

export interface Ayah {
  _id: string;
  surah: string;
  ayah_number: number;
  text_ar: string;
  text_mm: string;
}

// ─── Hadith ───────────────────────────────────────────────────────────────────

export interface HadithBook {
  _id: string;
  book_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  author: string;
  totalHadith: number;
}

export interface HadithChapter {
  _id: string;
  book: string;
  chapter_number: number;
  name_ar: string;
  name_mm: string;
  name_en: string;
  totalHadith: number;
}

export interface Hadith {
  _id: string;
  book: string | HadithBook;
  chapter: string | HadithChapter;
  hadith_number: number;
  text_ar: string;
  text_mm: string;
  grade: string;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export type SearchResultType = "surah" | "ayah" | "hadith";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  // For navigation
  surahId?: string;
  ayahNumber?: number;
  bookId?: string;
  chapterId?: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
