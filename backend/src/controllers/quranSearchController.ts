import { Request, Response } from "express";
import Surah from "../models/Surah";
import Ayah from "../models/Ayah";

// ─── Quran Search ─────────────────────────────────────────────────────────────
// Add this function to your existing surahControllers.ts
// and register it in surahRoutes.ts as:
//   router.get("/search", searchQuran);

export const searchQuran = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q)
      return res.status(400).json({ message: "Query parameter 'q' is required" });

    const results: any[] = [];

    // 1. Surah — name_mm, name_en, name_ar, surah_number
    const surahQuery: any = {
      $or: [
        { name_mm: { $regex: q, $options: "i" } },
        { name_en: { $regex: q, $options: "i" } },
        { name_ar: { $regex: q } },
      ],
    };
    if (!isNaN(Number(q))) {
      surahQuery.$or.push({ surah_number: Number(q) });
    }

    const surahs = await Surah.find(surahQuery).limit(10);
    surahs.forEach((s) => {
      results.push({
        type: "surah",
        id: s._id,
        title: s.name_mm,
        subtitle: `${s.surah_number} · ${s.name_en}`,
        highlight: s.name_ar,
        surahId: s._id,
      });
    });

    // 2. Ayah — full-text search on text_mm (uses the text index)
    const ayahs = await Ayah.find({ $text: { $search: q } })
      .populate("surah")
      .limit(20);

    ayahs.forEach((a) => {
      results.push({
        type: "ayah",
        id: a._id,
        title: (a.surah as any).name_mm,
        subtitle: `သူရ ${(a.surah as any).surah_number}၊ အာယာ ${a.ayah_number}`,
        highlight: a.text_mm.slice(0, 120),
        surahId: (a.surah as any)._id,
        ayahNumber: a.ayah_number,
      });
    });

    res.status(200).json({ data: results });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while searching Quran: ${err.message}` });
  }
};
