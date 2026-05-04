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
  surah: string;
  ayah_number: number;
  text_ar: string;
  text_mm: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Page = "dashboard" | "surahs" | "ayahs";
