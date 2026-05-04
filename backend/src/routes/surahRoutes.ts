import express, { Router } from "express";
import {
  addSurah,
  deleteSurahById,
  getAllSurahs,
  getSurahById,
  updateSurahById,
} from "../controllers/surahControllers";
import { validateSurah } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router: Router = express.Router();

router.route("/").get(getAllSurahs).post(validateSurah, addSurah);

router
  .route("/:id")
  .all(validateId)
  .get(getSurahById)
  .put(validateSurah, updateSurahById)
  .delete(deleteSurahById);

export default router;
