"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const surahControllers_1 = require("../controllers/surahControllers");
const validateData_1 = require("../middlewares/validateData");
const validateId_1 = require("../middlewares/validateId");
const router = express_1.default.Router();
router.route("/").get(surahControllers_1.getAllSurahs).post(validateData_1.validateSurah, surahControllers_1.addSurah);
router
    .route("/:id")
    .all(validateId_1.validateId)
    .get(surahControllers_1.getSurahById)
    .put(validateData_1.validateSurah, surahControllers_1.updateSurahById)
    .delete(surahControllers_1.deleteSurahById);
exports.default = router;
//# sourceMappingURL=surahRoutes.js.map