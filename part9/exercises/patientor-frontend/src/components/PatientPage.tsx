import { Diagnosis, Patient } from "../types";
import {
  Typography,
  Container,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

const PatientPage = ({
  patient,
  diagnoses,
}: {
  patient: Patient;
  diagnoses: Diagnosis[];
}) => {
  const gender = patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />;
  return (
    <div>
      <Typography
        variant="h4"
        style={{ margin: "1em 0em", fontWeight: "bold" }}
      >
        {patient.name} {gender}
      </Typography>
      <Container style={{ margin: "0em 0.5em" }}>
        <Typography variant="subtitle1">SSN: {patient.ssn}</Typography>
        <Typography variant="subtitle1">
          occupation: {patient.occupation}
        </Typography>
        <Typography
          variant="h6"
          style={{ marginBottom: "1em", fontWeight: "bold" }}
        >
          entries
        </Typography>
        {patient.entries?.map((entry) => (
          <div key={entry.id}>
            {entry.date} <em>{entry.description}</em>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>
                  <strong>{code}</strong>{" "}
                  {diagnoses.find((d) => d.code === code)!.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default PatientPage;
