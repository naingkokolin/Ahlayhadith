import express, { type Request, type Response } from "express";
import connectDB from "./config/db";
import cors from "cors";

import SurahRoutes from "./routes/surahRoutes";
import AyahRoutes from "./routes/ayahRoutes";

import HadithBookRoutes from "./routes/hadithBookRoutes";
import HadithChapterRoutes from "./routes/hadithChapterRoutes";
import HadithRoutes from "./routes/hadithRoutes";
import HadithBibleRoutes from "./routes/hadithBibleRoutes";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 9000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use("/api/surahs", SurahRoutes);
app.use("/api/ayahs", AyahRoutes);

app.use("/api/hadith-bibles", HadithBibleRoutes);
app.use("/api/hadith-books", HadithBookRoutes);
app.use("/api/hadith-chapters", HadithChapterRoutes);
app.use("/api/hadiths", HadithRoutes); // includes GET /api/hadiths/search

connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`App is running on http:localhost:${port}`),
    );
  })
  .catch((err) => console.error("Failed to start the server!"));
