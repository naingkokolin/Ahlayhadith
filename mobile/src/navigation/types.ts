import { NavigatorScreenParams } from "@react-navigation/native";

// ─── Quran Stack ──────────────────────────────────────────────────────────────
export type QuranStackParamList = {
  SurahList: undefined;
  AyahList: { surahId: string; surahName: string; surahNumber: number };
};

// ─── Hadith Stack ─────────────────────────────────────────────────────────────
export type HadithStackParamList = {
  HadithBooks: undefined;
  HadithChapters: { bookId: string; bookName: string };
  HadithList: { chapterId: string; chapterName: string; bookName: string };
};

// ─── Root Stack ───────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  GlobalSearch: undefined;
  QuranStack: NavigatorScreenParams<QuranStackParamList>;
  HadithStack: NavigatorScreenParams<HadithStackParamList>;
};
