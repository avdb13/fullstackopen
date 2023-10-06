import { NewDiaryEntry, Visibility, Weather } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isWeather = (weather: string): boolean => {
  return Object.values(Weather)
    .map((v) => v.toString())
    .includes(weather);
};

const isVisibility = (visibility: string): boolean => {
  return Object.values(Visibility)
    .map((v) => v.toString())
    .includes(visibility);
};

const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error("incorrect or missing comment");
  }

  return comment;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`incorrect or missing date: ${date}`);
  }

  return date;
};

const parseWeather = (weather: unknown): Weather => {
  if (!isString(weather) || !isWeather(weather)) {
    throw new Error(`incorrect or missing weather: ${weather}`);
  }

  return weather as Weather;
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) {
    throw new Error(`incorrect or missing visibility: ${visibility}`);
  }

  return visibility as Visibility;
};

const toNewDiaryEntry = (obj: unknown): NewDiaryEntry => {
  if (!obj || typeof obj !== "object") {
    throw new Error("incorrect or missing data");
  }

  console.log(obj)

  if (
    "comment" in obj &&
    "date" in obj &&
    "weather" in obj &&
    "visibility" in obj
  ) {
    const newEntry: NewDiaryEntry = {
      comment: parseComment(obj.comment),
      date: parseDate(obj.date),
      weather: parseWeather(obj.weather),
      visibility: parseVisibility(obj.visibility),
    };

    return newEntry;
  }

  throw new Error("incorrect data: some fields are missing");
};

export { toNewDiaryEntry }
