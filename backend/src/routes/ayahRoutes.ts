import express from "express";
import {
  addAyah,
  deleteAyahById,
  getAllAyahs,
  getAyahById,
  updateAyahById,
} from "../controllers/ayahControllers";
import { validateAyah } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router = express.Router();

router.route("/").get(getAllAyahs).post(validateAyah, addAyah);

router
  .route("/:id")
  .all(validateId)
  .get(getAyahById)
  .put(validateAyah, updateAyahById)
  .delete(deleteAyahById);

export default router;
