import { Gender, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (gender: string): boolean => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("incorrect or missing name");
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("incorrect or missing dateOfBirth");
  }
  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("incorrect or missing ssn");
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("incorrect or missing gender");
  }

  return gender as Gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("incorrect or missing occupation");
  }
  return occupation;
};

const toNewPatient = (obj: unknown): NewPatient => {
  if (!obj || typeof obj !== "object") {
    throw new Error("invalid or missing data");
  }

  if (
    "name" in obj &&
    "dateOfBirth" in obj &&
    "ssn" in obj &&
    "gender" in obj &&
    "occupation" in obj
  ) {
    const newPatient: NewPatient = {
      name: parseName(obj.name),
      dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
      ssn: parseSsn(obj.ssn),
      gender: parseGender(obj.gender),
      occupation: parseOccupation(obj.occupation),
    };

    return newPatient;
  }

  throw new Error("incorrect data: some fields are missing");
};

export { toNewPatient }
