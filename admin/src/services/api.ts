import axios, { AxiosResponse } from "axios";
import { ISurah, IAyah, IHadithBook, IHadithChapter, IHadith } from "../types";

const API_URL = "https://ahlayhadith.onrender.com/api";

const api = axios.create({ baseURL: API_URL });

// ─── Surahs ───────────────────────────────────────────────────
export const getSurahs = (): Promise<AxiosResponse<{ surahs: ISurah[] }>> =>
  api.get("/surahs");
export const createSurah = (
  data: ISurah,
): Promise<AxiosResponse<{ surah: ISurah }>> => api.post("/surahs", data);
export const updateSurah = (
  id: string,
  data: Partial<ISurah>,
): Promise<AxiosResponse<{ surah: ISurah }>> => api.put(`/surahs/${id}`, data);
export const deleteSurah = (id: string): Promise<AxiosResponse> =>
  api.delete(`/surahs/${id}`);

// ─── Ayahs ────────────────────────────────────────────────────
export const getAyahs = (): Promise<AxiosResponse<{ ayahs: IAyah[] }>> =>
  api.get("/ayahs");
export const createAyah = (
  data: IAyah,
): Promise<AxiosResponse<{ ayah: IAyah }>> => api.post("/ayahs", data);
export const updateAyah = (
  id: string,
  data: Partial<IAyah>,
): Promise<AxiosResponse<{ ayah: IAyah }>> => api.put(`/ayahs/${id}`, data);
export const deleteAyah = (id: string): Promise<AxiosResponse> =>
  api.delete(`/ayahs/${id}`);

// ─── Hadith Books ─────────────────────────────────────────────
export const getHadithBooks = (): Promise<
  AxiosResponse<{ books: IHadithBook[] }>
> => api.get("/hadith-books");
export const createHadithBook = (
  data: IHadithBook,
): Promise<AxiosResponse<{ book: IHadithBook }>> =>
  api.post("/hadith-books", data);
export const updateHadithBook = (
  id: string,
  data: Partial<IHadithBook>,
): Promise<AxiosResponse<{ book: IHadithBook }>> =>
  api.put(`/hadith-books/${id}`, data);
export const deleteHadithBook = (id: string): Promise<AxiosResponse> =>
  api.delete(`/hadith-books/${id}`);

// ─── Hadith Chapters ──────────────────────────────────────────
export const getHadithChapters = (): Promise<
  AxiosResponse<{ chapters: IHadithChapter[] }>
> => api.get("/hadith-chapters");
export const createHadithChapter = (
  data: IHadithChapter,
): Promise<AxiosResponse<{ chapter: IHadithChapter }>> =>
  api.post("/hadith-chapters", data);
export const updateHadithChapter = (
  id: string,
  data: Partial<IHadithChapter>,
): Promise<AxiosResponse<{ chapter: IHadithChapter }>> =>
  api.put(`/hadith-chapters/${id}`, data);
export const deleteHadithChapter = (id: string): Promise<AxiosResponse> =>
  api.delete(`/hadith-chapters/${id}`);

// ─── Hadiths ──────────────────────────────────────────────────
export const getHadiths = (): Promise<AxiosResponse<{ hadiths: IHadith[] }>> =>
  api.get("/hadiths");
export const createHadith = (
  data: IHadith,
): Promise<AxiosResponse<{ hadith: IHadith }>> => api.post("/hadiths", data);
export const updateHadith = (
  id: string,
  data: Partial<IHadith>,
): Promise<AxiosResponse<{ hadith: IHadith }>> =>
  api.put(`/hadiths/${id}`, data);
export const deleteHadith = (id: string): Promise<AxiosResponse> =>
  api.delete(`/hadiths/${id}`);
