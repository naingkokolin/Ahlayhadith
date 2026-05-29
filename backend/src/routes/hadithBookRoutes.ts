import express from "express";
import {
  addHadithBook,
  deleteHadithBookById,
  getAllHadithBooks,
  getHadithBookById,
  updateHadithBookById,
} from "../controllers/hadithBookControllers";
import { validateHadithBook } from "../middlewares/validateData";
import { validateId } from "../middlewares/validateId";

const router = express.Router();

router.route("/").get(getAllHadithBooks).post(validateHadithBook, addHadithBook);

router
  .route("/:id")
  .all(validateId)
  .get(getHadithBookById)
  .put(validateHadithBook, updateHadithBookById)
  .delete(deleteHadithBookById);

export default router;
