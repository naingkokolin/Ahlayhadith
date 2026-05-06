"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ayahControllers_1 = require("../controllers/ayahControllers");
const validateData_1 = require("../middlewares/validateData");
const validateId_1 = require("../middlewares/validateId");
const router = express_1.default.Router();
router.route("/").get(ayahControllers_1.getAllAyahs).post(validateData_1.validateAyah, ayahControllers_1.addAyah);
router
    .route("/:id")
    .all(validateId_1.validateId)
    .get(ayahControllers_1.getAyahById)
    .put(validateData_1.validateAyah, ayahControllers_1.updateAyahById)
    .delete(ayahControllers_1.deleteAyahById);
exports.default = router;
//# sourceMappingURL=ayahRoutes.js.map