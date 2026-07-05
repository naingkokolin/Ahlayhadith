import express from "express";
import {
  addHadithChapter,
  deleteHadithChapterById,
  getAllHadithChapters,
  getChaptersByBookId,
  getHadithChapterById,
  updateHadithChapterById,
} from "../controllers/hadithChapterControllers";
import { validateHadithChapter } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router = express.Router();

// router.put("/bulk-update-hadith-chapter", updateBibleKeyInAllChapters);

// GET all chapters / POST new chapter
router
  .route("/")
  .get(getAllHadithChapters)
  .post(validateHadithChapter, addHadithChapter);

// GET chapters belonging to a specific book
// e.g. GET /api/hadith-chapters/book/:bookId
router.get("/book/:bookId", validateId, getChaptersByBookId);

// router.get("/book/:bookId", getChaptersByBookId);

router
  .route("/:id")
  .all(validateId)
  .get(getHadithChapterById)
  .put(validateHadithChapter, updateHadithChapterById)
  .delete(deleteHadithChapterById);

export default router;
