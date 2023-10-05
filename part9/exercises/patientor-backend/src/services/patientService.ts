import patients from "../data/patients";
import { v1 as uuid } from "uuid";
import { Patient, NonSensitivePatient, NewPatient } from "../types";

const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = (entry: NewPatient): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const id: string = uuid();

  const newPatient: Patient = {
    ...entry,
    id,
  };

  patients.push(newPatient);
  return newPatient;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn, ...partial } = p;
    return partial;
  });
};

export default { getPatients, getNonSensitivePatients, addPatient };
