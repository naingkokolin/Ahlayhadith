import express from "express";
import {
  addHadith,
  deleteHadithById,
  getAllHadiths,
  getHadithById,
  getHadithsByChapterId,
  searchHadiths,
  updateHadithById,
} from "../controllers/hadithControllers";
import { validateHadith } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router = express.Router();

// Search — must come before /:id to avoid conflict
router.get("/search", searchHadiths);

// GET all hadiths / POST new hadith
router.route("/").get(getAllHadiths).post(validateHadith, addHadith);

// GET hadiths by chapter
// e.g. GET /api/hadiths/chapter/:chapterId
router.get("/chapter/:chapterId", validateId, getHadithsByChapterId);

router
  .route("/:id")
  .all(validateId)
  .get(getHadithById)
  .put(validateHadith, updateHadithById)
  .delete(deleteHadithById);

export default router;
