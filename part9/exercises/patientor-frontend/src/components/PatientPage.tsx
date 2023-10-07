import { Patient } from "../types";
import {
  Typography,
  Container,
  ListItem,
  List,
  ListItemIcon,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import StarIcon from "@mui/icons-material/Star";

const PatientPage = ({ patient }: { patient: Patient }) => {
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
          <div>
            {entry.date} <em>{entry.description}</em>
            <List>
              {entry.diagnosisCodes?.map((code) => (
                <ListItem>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  {code}
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default PatientPage;
