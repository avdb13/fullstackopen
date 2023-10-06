import axios from "axios";
import { DiaryEntry } from "../types";

const baseUrl: string = "http://localhost:3000/diaries";

export const getAll = () => {
  return axios.get<DiaryEntry[]>(baseUrl).then((resp) => resp.data);
};
