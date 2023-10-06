import express, { Request } from "express";
import diaryService from "../services/diaryService";
import { toNewDiaryEntry } from "../validators";
const router = express.Router();
// router.use(express.json())

router.get("/", (_req, resp) => {
  resp.send(diaryService.getNonSensitiveEntries());
});

router.get("/:id", (req, resp) => {
  const diary = diaryService.findById(Number(req.params.id));
  if (diary) {
    resp.send(diary);
  } else {
    resp.status(404).end();
  }
});

router.post("/", (req: Request, resp) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body)
    const addedEntry = diaryService.addDiary(newDiaryEntry)

    resp.json(addedEntry)
  } catch (e: unknown) {
    if (e instanceof Error) {
      resp.status(400).send(e.message)
    }
  }
});

export default router;
