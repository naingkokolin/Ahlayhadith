"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: `Invalid ID format`,
        });
    }
    next();
};
exports.validateId = validateId;
//# sourceMappingURL=validateId.js.map