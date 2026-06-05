import express from "express";
import {
  addHadithBible,
  deleteHadithBibleById,
  getAllHadithBibles,
  getHadithBibleById,
  updateHadithBibleById,
} from "../controllers/hadithBibleControllers";

const router = express.Router();

router.route("/").get(getAllHadithBibles).post(addHadithBible);

router
  .route("/:id")
  .get(getHadithBibleById)
  .put(updateHadithBibleById)
  .delete(deleteHadithBibleById);

export default router;
