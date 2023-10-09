import patients from "../data/patients";
import { v1 as uuid } from "uuid";
import { Patient, NonSensitivePatient, NewPatient, EntryWithoutId, Entry } from "../types";

const getAllPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient => {
  return patients.filter((p) => p.id === id)[0];
};

const getAllNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn, ...partial } = p;
    return partial;
  });
};

const addPatient = (entry: NewPatient): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const id: string = uuid();

  const newPatient: Patient = {
    ...entry,
    entries: [],
    id,
  };

  patients.push(newPatient);
  return newPatient;
};

const addPatientEntries = (patientId: string, entry: EntryWithoutId): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const id: string = uuid();

  const newEntry: Entry = {
    ...entry,
    id,
  };

  const updatedPatient = patients.find(p => p.id === patientId)!
  updatedPatient.entries.push(newEntry)
  // updates itself?
  // patients = patients.map(p => p.id === patientId ? updatedPatient : p)
  return updatedPatient;
};

export default { getAllPatients, getPatient, addPatientEntries, getAllNonSensitivePatients, addPatient };
