import express from "express";
import diaryRouter from "./routes/diaries";

const app = express();
app.use(diaryRouter);
app.use(express.json())

const PORT = 3000;

app.get("/", (_req, resp) => {
  resp.send("Fetching all diaries");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
