import { Request, Response } from "express";
import Hadith from "../models/Hadith";
import HadithChapter from "../models/HadithChapter";
import mongoose, { MongooseError } from "mongoose";

export const getAllHadiths = async (req: Request, res: Response) => {
  try {
    const hadiths = await Hadith.find()
      .populate("bible")
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

// export const addHadith = async (req: Request, res: Response) => {
//   try {
//     const { bible, book, chapter, hadith_number, text_ar, text_mm, grade } =
//       req.body;

//     let finalHadithNumber = hadith_number;

//     if (!hadith_number || hadith_number === 0) {
//       const lastHadith = await Hadith.findOne({ book })
//         .sort({ hadith_number: 1 })
//         .limit(1);

//       finalHadithNumber = lastHadith ? lastHadith.hadith_number + 1 : 1;
//     }

//     const newHadith = await Hadith.create({
//       bible,
//       book,
//       chapter,
//       hadith_number: finalHadithNumber,
//       text_ar,
//       text_mm,
//       grade,
//     });
//     res.status(201).json({ hadith: newHadith });
//   } catch (error) {
//     //const err = error as Error;
//     if ((error as any).code === 110000) {
//       return res.status(400).json({
//         err: "A hadith with this number alread exists in the database!",
//       });
//     }
//     res
//       .status(500)
//       .json({
//         error: `Error while adding new Hadith: ${(error as Error).message}`,
//       });
//   }
// };

// export const addHadith = async (req: Request, res: Response) => {
//   try {
//     const { bible, book, chapter, hadith_number, text_ar, text_mm, grade } =
//       req.body;

//     let finalHadithNumber = hadith_number;

//     if (!hadith_number || hadith_number === 0) {
//       // Find the last (highest) hadith_number for this book
//       const lastHadith = await Hadith.findOne({ book })
//         .sort({ hadith_number: -1 }) // ✅ Sort DESCENDING to get highest number
//         .limit(1);

//       finalHadithNumber = lastHadith ? lastHadith.hadith_number + 1 : 1;
//     }

//     const newHadith = await Hadith.create({
//       bible,
//       book,
//       chapter,
//       hadith_number: finalHadithNumber,
//       text_ar,
//       text_mm,
//       grade: grade || "Sahih", // ✅ Add default grade
//     });

//     res.status(201).json({ hadith: newHadith });
//   } catch (error) {
//     // ✅ Fixed: MongoDB duplicate key error code is 11000
//     if ((error as any).code === 11000) {
//       return res.status(400).json({
//         error: "A hadith with this number already exists in the database!",
//       });
//     }
//     res.status(500).json({
//       error: `Error while adding new Hadith: ${(error as Error).message}`,
//     });
//   }
// };

export const addHadith = async (req: Request, res: Response) => {
  try {
    const { bible, book, chapter, hadith_number, text_ar, text_mm, grade } =
      req.body;

    // Validate all required fields (hadith_number is required from admin)
    if (!bible || !book || !chapter || !hadith_number || !text_ar || !text_mm) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }

    console.log("Destructured bible:", bible);

    const bibleId = bible || req.body.bible;

    if (!bibleId) {
      return res.status(400).json({
        error: "Bible field is required!",
        receivedBody: req.body,
      });
    }

    // console.log("req.body:", req.body);

    // console.log("Creating:", {
    //   bible: bibleId,
    //   book,
    //   chapter,
    //   hadith_number,
    //   text_ar,
    //   text_mm,
    //   grade,
    // });

    const newHadith = await Hadith.create({
      bible: bibleId,
      book,
      chapter,
      hadith_number,
      text_ar,
      text_mm,
      grade: grade || "Sahih",
    });

    res.status(201).json({ hadith: newHadith });
  } catch (error: any) {
    console.error("Error adding hadith:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "A hadith with this number already exists in this book!",
      });
    }

    res.status(500).json({
      error: `Error while adding new Hadith: ${error.message}`,
    });
  }
};

export const getHadithById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hadith = await Hadith.findById(id)
      .populate("bible")
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

export const updateBibleKeyInAllHadiths = async (
  req: Request,
  res: Response,
) => {
  try {
    const targetBibleId = "6a2291a5a806a6d78c1605a5";
    const objectIdValue = new mongoose.Types.ObjectId(targetBibleId);

    const result = await Hadith.updateMany(
      { bible: { $exists: false } },
      { $set: { bible: objectIdValue } },
    );

    return res.status(200).json({
      message: "Successfully added bible key to documents",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};
