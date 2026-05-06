"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const surahRoutes_1 = __importDefault(require("./routes/surahRoutes"));
const ayahRoutes_1 = __importDefault(require("./routes/ayahRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 9000;
app.get("/", (req, res) => {
    res.send("hello world");
});
app.use("/api/surahs", surahRoutes_1.default);
app.use("/api/ayahs", ayahRoutes_1.default);
(0, db_1.default)()
    .then(() => {
    app.listen(port, () => console.log(`App is running on http:localhost:${port}`));
})
    .catch((err) => console.error("Failed to start the server!"));
//# sourceMappingURL=server.js.map