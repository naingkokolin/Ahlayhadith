import { Request, Response } from "express";
import Hadith from "../models/Hadith";
import HadithChapter from "../models/HadithChapter";

export const getAllHadiths = async (req: Request, res: Response) => {
  try {
    const hadiths = await Hadith.find()
      .populate("book")
      .populate("chapter")
      .sort({ hadith_number: 1 });
    if (hadiths.length === 0)
      return res
        .status(404)
        .json({ message: "No Hadith found in the database!" });

    res.status(200).json({ hadiths });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Hadiths: ${err.message}` });
  }
};

export const getHadithsByChapterId = async (req: Request, res: Response) => {
  const { chapterId } = req.params;
  try {
    const hadiths = await Hadith.find({
      chapter: chapterId as string,
    })
      .populate("bible", "_id")
      .populate("book", "_id")
      .populate("chapter", "_id") // remove _id from these to get the full object
      .sort({ hadith_number: 1 });
    if (hadiths.length === 0)
      return res.status(404).json({
        message: `No hadiths found for chapter id: ${chapterId}`,
      });

    res.status(200).json({ hadiths });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: `Error while getting hadiths by chapter id: ${err.message}`,
    });
  }
};

export const addHadith = async (req: Request, res: Response) => {
  try {
    const { book, chapter, hadith_number, text_ar, text_mm, grade } = req.body;
    const newHadith = await Hadith.create({
      book,
      chapter,
      hadith_number,
      text_ar,
      text_mm,
      grade,
    });
    res.status(201).json({ hadith: newHadith });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while adding new Hadith: ${err.message}` });
  }
};

export const getHadithById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hadith = await Hadith.findById(id)
      .populate("book")
      .populate("chapter");
    if (!hadith)
      return res
        .status(404)
        .json({ message: `No Hadith found with this id: ${id}` });

    res.status(200).json({ hadith });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while getting Hadith by id: ${err.message}` });
  }
};

export const updateHadithById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedHadith = await Hadith.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedHadith)
      return res
        .status(404)
        .json({ message: `No Hadith found with this id: ${id}!` });

    res.status(200).json({ hadith: updatedHadith });
  } catch (error) {
    res.status(500).json({
      error: `Error while updating Hadith: ${(error as Error).message}`,
    });
  }
};

export const deleteHadithById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hadith = await Hadith.findById(id);
    if (!hadith)
      return res
        .status(404)
        .json({ message: `No Hadith found with this ID: ${id}` });

    await Hadith.findByIdAndDelete(id);
    res.status(200).json({ message: `Hadith id: ${id} was deleted.` });
  } catch (error) {
    res.status(500).json({
      error: `Error while deleting Hadith: ${(error as Error).message}`,
    });
  }
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchHadiths = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q)
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });

    const results: any[] = [];

    // 1. Exact hadith_number match (if query is numeric)
    if (!isNaN(Number(q))) {
      const byNumber = await Hadith.find({ hadith_number: Number(q) })
        .populate("book")
        .populate("chapter")
        .limit(10);

      byNumber.forEach((h) => {
        results.push({
          type: "hadith",
          id: h._id,
          title: h.text_mm.slice(0, 80),
          subtitle: `${(h.book as any).name_mm} · ဟဒီး ${h.hadith_number}`,
          highlight: h.text_mm.slice(0, 120),
          bookId: (h.book as any)._id,
          chapterId: (h.chapter as any)._id,
        });
      });
    }

    // 2. Full-text search on text_mm (uses the text index)
    const byText = await Hadith.find({ $text: { $search: q } })
      .populate("book")
      .populate("chapter")
      .limit(20);

    byText.forEach((h) => {
      // Avoid duplicates already added from number search
      if (!results.find((r) => String(r.id) === String(h._id))) {
        results.push({
          type: "hadith",
          id: h._id,
          title: h.text_mm.slice(0, 80),
          subtitle: `${(h.book as any).name_mm} · ဟဒီး ${h.hadith_number}`,
          highlight: h.text_mm.slice(0, 120),
          bookId: (h.book as any)._id,
          chapterId: (h.chapter as any)._id,
        });
      }
    });

    // 3. Partial match on chapter / book names (Myanmar)
    const matchingChapters = await HadithChapter.find({
      $or: [
        { name_mm: { $regex: q, $options: "i" } },
        { name_en: { $regex: q, $options: "i" } },
      ],
    }).limit(5);

    for (const chapter of matchingChapters) {
      const hadiths = await Hadith.find({ chapter: chapter._id })
        .populate("book")
        .limit(5);
      hadiths.forEach((h) => {
        if (!results.find((r) => String(r.id) === String(h._id))) {
          results.push({
            type: "hadith",
            id: h._id,
            title: h.text_mm.slice(0, 80),
            subtitle: `${(h.book as any).name_mm} · ဟဒီး ${h.hadith_number}`,
            highlight: h.text_mm.slice(0, 120),
            bookId: (h.book as any)._id,
            chapterId: chapter._id,
          });
        }
      });
    }

    res.status(200).json({ data: results });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: `Error while searching Hadiths: ${err.message}` });
  }
};

// import { Request, Response } from "express";
// import { Types } from "mongoose";
// import Hadith from "../models/Hadith.js";
// import HadithChapter from "../models/HadithChapter.js";

// // Search interface definition for strict type safety
// interface SearchResult {
//   type: "hadith";
//   id: Types.ObjectId;
//   title: string;
//   subtitle: string;
//   highlight: string;
//   bookId: Types.ObjectId;
//   chapterId: Types.ObjectId;
// }

// export const getAllHadiths = async (req: Request, res: Response) => {
//   try {
//     const hadiths = await Hadith.find()
//       .populate("book")
//       .populate("chapter")
//       .sort({ hadith_number: 1 });

//     if (hadiths.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No Hadith found in the database!" });
//     }

//     res.status(200).json({ hadiths });
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .json({ error: `Error while getting Hadiths: ${err.message}` });
//   }
// };

// export const getHadithsByChapterId = async (req: Request, res: Response) => {
//   const { chapterId } = req.params;
//   try {
//     const hadiths = await Hadith.find({
//       chapter: new Types.ObjectId(chapterId as string),
//     })
//       .populate("book")
//       .populate("chapter")
//       .sort({ hadith_number: 1 });

//     if (hadiths.length === 0) {
//       return res.status(404).json({
//         message: `No hadiths found for chapter id: ${chapterId}`,
//       });
//     }

//     res.status(200).json({ hadiths });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({
//       error: `Error while getting hadiths by chapter id: ${err.message}`,
//     });
//   }
// };

// export const addHadith = async (req: Request, res: Response) => {
//   try {
//     const { book, chapter, hadith_number, text_ar, text_mm, grade } = req.body;
//     const newHadith = await Hadith.create({
//       book,
//       chapter,
//       hadith_number,
//       text_ar,
//       text_mm,
//       grade,
//     });
//     res.status(201).json({ hadith: newHadith });
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .json({ error: `Error while adding new Hadith: ${err.message}` });
//   }
// };

// export const getHadithById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const hadith = await Hadith.findById(id)
//       .populate("book")
//       .populate("chapter");
//     if (!hadith) {
//       return res
//         .status(404)
//         .json({ message: `No Hadith found with this id: ${id}` });
//     }

//     res.status(200).json({ hadith });
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .json({ error: `Error while getting Hadith by id: ${err.message}` });
//   }
// };

// export const updateHadithById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const updatedHadith = await Hadith.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updatedHadith) {
//       return res
//         .status(404)
//         .json({ message: `No Hadith found with this id: ${id}!` });
//     }

//     res.status(200).json({ hadith: updatedHadith });
//   } catch (error) {
//     res.status(500).json({
//       error: `Error while updating Hadith: ${(error as Error).message}`,
//     });
//   }
// };

// export const deleteHadithById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const deletedHadith = await Hadith.findByIdAndDelete(id);
//     if (!deletedHadith) {
//       return res
//         .status(404)
//         .json({ message: `No Hadith found with this ID: ${id}` });
//     }

//     res.status(200).json({ message: `Hadith id: ${id} was deleted.` });
//   } catch (error) {
//     res.status(500).json({
//       error: `Error while deleting Hadith: ${(error as Error).message}`,
//     });
//   }
// };

// // ─── Search ───────────────────────────────────────────────────────────────────

// export const searchHadiths = async (req: Request, res: Response) => {
//   try {
//     const q = String(req.query.q || "").trim();
//     if (!q) {
//       return res
//         .status(400)
//         .json({ message: "Query parameter 'q' is required" });
//     }

//     const results: SearchResult[] = [];

//     // Helper to push with duplication check
//     const pushResult = (h: any) => {
//       if (!results.some((r) => String(r.id) === String(h._id))) {
//         const bookName = h.book ? (h.book as any).name_mm : "Unknown Book";
//         const bookId = h.book ? (h.book as any)._id : null;
//         const chapterId = h.chapter ? (h.chapter as any)._id : null;

//         results.push({
//           type: "hadith",
//           id: h._id,
//           title: h.text_mm.slice(0, 80),
//           subtitle: `${bookName} · ဟဒီး ${h.hadith_number}`,
//           highlight: h.text_mm.slice(0, 120),
//           bookId,
//           chapterId,
//         });
//       }
//     };

//     // 1. Exact hadith_number match (if query is numeric)
//     if (!isNaN(Number(q))) {
//       const byNumber = await Hadith.find({ hadith_number: Number(q) })
//         .populate("book")
//         .populate("chapter")
//         .limit(10);

//       byNumber.forEach(pushResult);
//     }

//     // 2. Full-text search on text_mm (uses the text index)
//     const byText = await Hadith.find({ $text: { $search: q } })
//       .populate("book")
//       .populate("chapter")
//       .limit(20);

//     byText.forEach(pushResult);

//     // 3. Partial match on chapter / book names (Myanmar) - Powered by Promise.all
//     const matchingChapters = await HadithChapter.find({
//       $or: [
//         { name_mm: { $regex: q, $options: "i" } },
//         { name_en: { $regex: q, $options: "i" } },
//       ],
//     }).limit(5);

//     if (matchingChapters.length > 0) {
//       const chapterQueries = matchingChapters.map((chapter) =>
//         Hadith.find({ chapter: chapter._id })
//           .populate("book")
//           .populate("chapter")
//           .limit(5),
//       );

//       const hadithsGroup = await Promise.all(chapterQueries);
//       hadithsGroup.flat().forEach(pushResult);
//     }

//     res.status(200).json({ data: results });
//   } catch (error) {
//     const err = error as Error;
//     res
//       .status(500)
//       .json({ error: `Error while searching Hadiths: ${err.message}` });
//   }
// };
