import diagnoses from "../src/data/diagnoses";
import {
  Entry,
  EntryWithoutId,
  Gender,
  NewPatient,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
  genderList,
} from "./types";
import { z } from "zod";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (gender: string): boolean => {
  const _genderList: readonly string[] = genderList;
  return _genderList.includes(gender);
};

const isObject = (v: unknown): v is object =>
  (v as boolean) && typeof v === "object";

const isEntry = (v: unknown): v is Entry => {
  return (
    isObject(v) &&
    "description" in v &&
    "date" in v &&
    "specialist" in v &&
    "type" in v
  );
};

const isPatient = (v: unknown): v is NewPatient =>
  isObject(v) &&
  "name" in v &&
  "dateOfBirth" in v &&
  "ssn" in v &&
  "gender" in v &&
  "occupation" in v;

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("incorrect or missing name");
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("incorrect or missing date");
  }
  return date;
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
    throw new Error("invalid data");
  }

  if (isPatient(obj)) {
    const newPatient: NewPatient = {
      name: parseName(obj.name),
      dateOfBirth: parseDate(obj.dateOfBirth),
      ssn: parseSsn(obj.ssn),
      gender: parseGender(obj.gender),
      occupation: parseOccupation(obj.occupation),
    };

    return newPatient;
  }

  throw new Error("incorrect data: some fields are missing");
};

const baseEntryValidator = z.object({
  description: z.string({
    required_error: "description is required",
  }),
  date: z.coerce
    .date({
      required_error: "date is required",
    })
    .transform((d) => d.toISOString().slice(0, 10)),
  specialist: z.string({
    required_error: "specialist is required",
  }),
  diagnosisCodes: z.optional(
    z.array(
      z.string().refine((s) => diagnoses.map((d) => d.code).includes(s), {
        message: "code not part of known diagnoses",
      }),
    ),
  ),
  type: z.union([
    z.literal("Hospital"),
    z.literal("HealthCheck"),
    z.literal("OccupationalHealthcare"),
  ]),
});

const occupationalHealthcareValidator = z
  .object({
    employerName: z.string(),
    sickLeave: z
      .object({
        startDate: z.string(),
        endDate: z.string(),
      })
      .optional(),
  })
  .merge(baseEntryValidator);

const healthCheckEntryValidator = z
  .object({
    healthCheckRating: z.nativeEnum(HealthCheckRating, {
      invalid_type_error: "please select one of the options",
    }),
  })
  .merge(baseEntryValidator);

const hospitalValidator = z
  .object({
    discharge: z.object({
      date: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)),
      criteria: z.string(),
    }),
  })
  .merge(baseEntryValidator);

const toNewEntry = (obj: unknown): EntryWithoutId => {
  if (isEntry(obj)) {
    switch (obj.type) {
      case "OccupationalHealthcare":
        return occupationalHealthcareValidator.parse(
          obj,
        ) as OccupationalHealthcareEntry;
      case "HealthCheck":
        return healthCheckEntryValidator.parse(obj) as HealthCheckEntry;
      case "Hospital":
        return hospitalValidator.parse(obj) as HospitalEntry;
    }
  }

  throw new Error("some fields are missing");
};

export { toNewPatient, toNewEntry };
