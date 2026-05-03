import express from "express";
import {
  addAyah,
  getAllAyahs,
  getAyahById,
} from "../controllers/ayahControllers";
import { validateAyah } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router = express.Router();

router.get("/", getAllAyahs);

router.post("/", validateAyah, addAyah);

router.get("/:id", validateId, getAyahById);

export default router;
