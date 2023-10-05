import patients from "../data/patients";
import { Patient, NonSensitivePatient } from "../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn, ...partial} = p;
    return partial;
  });
};

export default { getPatients, getNonSensitivePatients };
