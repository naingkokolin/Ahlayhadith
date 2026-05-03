import express, { type Request, type Response } from "express";
import connectDB from "./config/db";

import SurahRoutes from "./routes/surahRoutes";
import AyahRoutes from "./routes/ayahRoutes";

const app = express();
app.use(express.json());
const port = process.env.PORT || 9000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use("/api/surahs", SurahRoutes);
app.use("/api/ayahs", AyahRoutes);

connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`App is running on http:localhost:${port}`),
    );
  })
  .catch((err) => console.error("Failed to start the server!"));
