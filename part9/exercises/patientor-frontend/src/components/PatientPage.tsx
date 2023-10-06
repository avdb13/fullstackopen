import { Patient } from "../types";
import { Typography } from "@mui/material";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

const PatientPage = ({ patient }: { patient: Patient }) => {
  const gender = patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />
  return (
    <div>
      <Typography variant="h5" style={{ margin: "1em", fontWeight: "bold" }}>
        {patient.name} {gender}
      </Typography>
      <Typography variant="subtitle1">SSN: {patient.ssn}</Typography>
      <Typography variant="subtitle1">occupation: {patient.occupation}</Typography>
    </div>
  );
};

export default PatientPage
