import {
  Entry,
  EntryWithoutId,
  Gender,
  NewPatient,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
} from "./types";

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

const isObject = (v: unknown): v is object =>
  (v as boolean) && typeof v === "object";

const isEntry = (v: unknown): v is Entry =>
  isObject(v) &&
  "description" in v &&
  "date" in v &&
  "specialist" in v &&
  "type" in v;

const isHospitalEntry = (v: EntryWithoutId): v is HospitalEntry =>
  v.type === "Hospital" &&
  "discharge" in v &&
  "date" in v.discharge &&
  "criteria" in v.discharge;

const isHealthCheckEntry = (v: EntryWithoutId): v is HealthCheckEntry =>
  v.type === "HealthCheck" && "healthCheckrating" in v;

const isOccupationalHealthcareEntry = (
  v: EntryWithoutId,
): v is OccupationalHealthcareEntry =>
  v.type === "OccupationalHealthcare" && "emloyerName" in v;

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

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error("incorrect or missing description");
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("incorrect or missing specialist");
  }
  return specialist;
};

const parseEmployer = (employer: unknown): string => {
  if (!employer || !isString(employer)) {
    throw new Error("incorrect or missing employer");
  }
  return employer;
};

const parseHealthCheckEntry = (entry: EntryWithoutId): Omit<HealthCheckEntry, "id"> => {
  if (!isHealthCheckEntry(entry) || !Object.values(HealthCheckRating).includes(entry.healthCheckRating)) {
    throw new Error("incorrect healthcheck entry");
  }

  return {
    ...entry,
    healthCheckRating: entry.healthCheckRating,
  }
}

const parseHospitalEntry = (entry: EntryWithoutId): Omit<HospitalEntry, "id"> => {
  if (!isHospitalEntry(entry) || !isString(entry.discharge.date) || !isString(entry.discharge.criteria)) {
    throw new Error("incorrect hospital entry");
  }

  return {
    ...entry,
    discharge: {
      date: parseDate(entry.discharge.date),
      criteria: parseCriteria(entry.discharge.criteria),
    }
  }
}

const parseOccupationalHealthcareEntry = (entry: EntryWithoutId): Omit<OccupationalHealthcareEntry, "id"> => {
  if (!isOccupationalHealthcareEntry(entry) || !isString(entry.employerName)) {
    throw new Error("incorrect occupational healthcare entry");
  }

  const required = {
    ...entry,
    employerName: parseEmployer(entry.employerName),
  };

  if (entry.sickLeave) {
    return {
      ...required,
      sickLeave: {
        startDate: parseDate(entry.sickLeave.startDate),
        endDate: parseDate(entry.sickLeave.endDate),
      }
    }
  } else {
    return {
      ...required,
    }
  }
}

const parseCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error("incorrect or missing criteria");
  }
  return criteria;
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
      dateOfBirth: parseDate(obj.dateOfBirth),
      ssn: parseSsn(obj.ssn),
      gender: parseGender(obj.gender),
      occupation: parseOccupation(obj.occupation),
    };

    return newPatient;
  }

  throw new Error("incorrect data: some fields are missing");
};

const toNewEntry = (obj: unknown): EntryWithoutId => {
  if (isObject(obj) && isEntry(obj)) {
    const newEntry: EntryWithoutId = {
      ...obj,
      description: parseDescription(obj.description),
      date: parseDate(obj.description),
      specialist: parseSpecialist(obj.specialist),
    };

    switch (obj.type) {
      case "OccupationalHealthcare":
        return parseOccupationalHealthcareEntry(newEntry);
      case "HealthCheck":
        return parseHealthCheckEntry(newEntry);
      case "Hospital":
        return parseHospitalEntry(newEntry);
    }
  }

  throw new Error("incorrect data: some fields are missing");
}

export { toNewPatient, toNewEntry };
