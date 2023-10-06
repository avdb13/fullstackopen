import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl: string = "http://localhost:3000/api/diaries";

export const getAll = async (): Promise<DiaryEntry[]> => {
  const resp = await axios.get<DiaryEntry[]>(baseUrl)
  return resp.data
};

export const create = async (newDiary: NewDiaryEntry): Promise<DiaryEntry> => {
  const resp = await axios.post(baseUrl, newDiary)
  return resp.data
};
