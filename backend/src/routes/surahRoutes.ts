import express, { Router } from "express";
import {
  addSurah,
  getAllSurahs,
  getSurahById,
} from "../controllers/surahControllers";
import { validateSurah } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router: Router = express.Router();

router.get("/", getAllSurahs);

router.post("/", validateSurah, addSurah);

router.get("/:id", validateId, getSurahById);

export default router;
