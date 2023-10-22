import express from "express";
import diaryRouter from "./routes/diaries";
import cors from "cors";

const app = express();
app.use(diaryRouter);
app.use(express.json())

const PORT = 3000;

app.use(cors())
app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
