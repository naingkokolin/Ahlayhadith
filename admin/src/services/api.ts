// src/services/api.ts
import axios, { AxiosResponse } from "axios";
import { ISurah, IAyah } from "../types";

const API_URL = "http://localhost:8000/api"; // ← updated to port 8000

const api = axios.create({
  baseURL: API_URL,
});

// Surahs
export const getSurahs = (): Promise<AxiosResponse<{ surahs: ISurah[] }>> =>
  api.get("/surahs");

export const createSurah = (
  data: ISurah,
): Promise<AxiosResponse<{ surah: ISurah }>> => api.post("/surahs", data);

export const deleteSurah = (id: string): Promise<AxiosResponse> =>
  api.delete(`/surahs/${id}`);

export const updateSurah = (
  id: string,
  data: Partial<ISurah>,
): Promise<AxiosResponse<{ surah: ISurah }>> => api.put(`/surahs/${id}`, data);

// Ayahs
export const getAyahs = (): Promise<AxiosResponse<{ ayahs: IAyah[] }>> =>
  api.get("/ayahs");

export const createAyah = (
  data: IAyah,
): Promise<AxiosResponse<{ ayah: IAyah }>> => api.post("/ayahs", data);

export const deleteAyah = (id: string): Promise<AxiosResponse> =>
  api.delete(`/ayahs/${id}`);

export const updateAyah = (
  id: string,
  data: Partial<IAyah>,
): Promise<AxiosResponse<{ ayah: IAyah }>> => api.put(`/ayahs/${id}`, data);

// import axios, { AxiosResponse } from "axios";
// import { ISurah, IAyah } from "../types";

// const API_URL = "http://localhost:8000/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// // --- Surah Services ---
// export const getSurahs = (): Promise<AxiosResponse<{ surahs: ISurah[] }>> =>
//   api.get("/surahs");

// export const createSurah = (
//   data: Omit<ISurah, "_id">,
// ): Promise<AxiosResponse<{ surah: ISurah }>> => api.post("/surahs", data);

// export const deleteSurah = (id: string): Promise<AxiosResponse> =>
//   api.delete(`/surahs/${id}`);

// export const updateSurah = (
//   id: string,
//   data: Partial<ISurah>,
// ): Promise<AxiosResponse<{ surah: ISurah }>> => api.put(`/surahs/${id}`, data);

// // --- Ayah Services ---
// export const getAyahs = (): Promise<AxiosResponse<{ ayahs: IAyah[] }>> =>
//   api.get("/ayahs");

// export const createAyah = (
//   data: Omit<IAyah, "_id">,
// ): Promise<AxiosResponse<{ ayah: IAyah }>> => api.post("/ayahs", data);

// export const deleteAyah = (id: string): Promise<AxiosResponse> =>
//   api.delete(`/ayahs/${id}`);

// export const updateAyah = (
//   id: string,
//   data: Partial<IAyah>,
// ): Promise<AxiosResponse<{ ayah: IAyah }>> => api.put(`/ayahs/${id}`, data);
