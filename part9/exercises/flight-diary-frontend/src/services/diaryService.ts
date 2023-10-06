import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl: string = "http://localhost:3000/diaries";

export const getAll = () => {
  return axios.get<DiaryEntry[]>(baseUrl).then((resp) => resp.data);
};

export const create = (newDiary: NewDiaryEntry) => {
  return axios.post(baseUrl, newDiary).then((resp) => resp.data as DiaryEntry);
};
