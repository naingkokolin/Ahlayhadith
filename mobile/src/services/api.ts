import {
  Surah,
  Ayah,
  HadithBook,
  HadithChapter,
  Hadith,
  SearchResult,
  HadithBible,
  ApiResponse,
  PaginatedResponse,
} from "../types";

// ─── Config ───────────────────────────────────────────────────────────────────
// Change this to your backend URL
const BASE_URL = "https://ahlayhadith.onrender.com/api"; //"http://192.168.100.66:3000/api"; // "http://localhost:3000/api";

const request = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
};

// ─── Quran ────────────────────────────────────────────────────────────────────

export const QuranApi = {
  getSurahs: () =>
    request<{ surahs: Surah[] }>("/surahs").then((r) => r.surahs),

  getSurah: (id: string) =>
    request<{ surah: Surah }>(`/surahs/${id}`).then((r) => r.surah),

  // fetches only ayahs belonging to this surah, sorted by ayah_number
  getAyahs: (surahId: string) =>
    request<{ ayahs: Ayah[] }>(`/ayahs?surah=${surahId}`).then((r) => r.ayahs),

  search: (query: string) =>
    request<{ data: SearchResult[] }>(
      `/surahs/search?q=${encodeURIComponent(query)}`,
    ).then((r) => r.data),
};

// ─── Hadith ───────────────────────────────────────────────────────────────────

export const HadithApi = {
  getBibles: () =>
    request<{ bibles: HadithBible[] }>("/hadith-bibles").then((r) => r.bibles),

  getBooks: () =>
    request<{ books: HadithBook[] }>("/hadith-books").then((r) => r.books),

  getBook: (id: string) =>
    request<{ book: HadithBook }>(`/hadith-books/${id}`).then((r) => r.book),

  getChapter: (chapterId: string) =>
    request<{ chapter: HadithChapter }>(`/hadith-chapters/${chapterId}`).then(
      (r) => r.chapter,
    ),

  getBooksByBible: (bibleId: string) =>
    request<{ books: HadithBook[] }>(`/hadith-books/bible/${bibleId}`).then(
      (r) => r.books,
    ),

  getChapters: () =>
    request<{ chapters: HadithChapter[] }>("/hadith-chapters").then(
      (r) => r.chapters,
    ),

  getChaptersByBook: (bookId: string) =>
    request<{ chapters: HadithChapter[] }>(
      `/hadith-chapters/book/${bookId}`,
    ).then((r) => r.chapters),

  getHadithsByChapter: (chapterId: string) =>
    request<{ hadiths: Hadith[] }>(`/hadiths/chapter/${chapterId}`).then(
      (r) => r.hadiths,
    ),

  getHadith: (hadithId: string) =>
    request<{ hadith: Hadith }>(`/hadiths/${hadithId}`).then((r) => r.hadith),

  getHadiths: () =>
    request<{ hadiths: Hadith[] }>("/hadiths").then((r) => r.hadiths),

  search: (query: string) =>
    request<{ data: SearchResult[] }>(
      `/hadiths/search?q=${encodeURIComponent(query)}`,
    ).then((r) => r.data),
};

// ─── Global Search ────────────────────────────────────────────────────────────

export const GlobalSearchApi = {
  /**
   * Search across everything:
   * surah name (mm/en/ar), surah number,
   * ayah text_mm, hadith text_mm, hadith number
   */
  search: async (query: string): Promise<SearchResult[]> => {
    const [quranResults, hadithResults] = await Promise.allSettled([
      QuranApi.search(query),
      HadithApi.search(query),
    ]);

    const results: SearchResult[] = [];
    if (quranResults.status === "fulfilled")
      results.push(...quranResults.value);
    if (hadithResults.status === "fulfilled")
      results.push(...hadithResults.value);
    return results;
  },
};
