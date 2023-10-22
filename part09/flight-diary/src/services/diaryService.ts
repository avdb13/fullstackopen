import diaries from "../../data/entries";

import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from "../types";

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  diaries.forEach((diary) => {
    delete diary.comment;
  });
  return diaries;
};

const findById = (id: number): DiaryEntry | undefined => {
  const entry = diaries.find((d) => d.id === id);
  return entry;
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiary = {
    ...entry,
    id: Math.max(...diaries.map(d => d.id)) + 1,
  };

  diaries.push(newDiary);
  return newDiary;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
  findById,
};
