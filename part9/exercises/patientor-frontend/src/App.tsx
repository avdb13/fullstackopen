import { useState, useEffect } from "react";
import axios from "axios";
import {
  Route,
  Link,
  Routes,
  useMatch,
} from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";

import patientService from "./services/patients";
import diagnoseService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const match = useMatch("/:id");

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      const diagnoses = await diagnoseService.getAll();

      setPatients(patients);
      setDiagnoses(diagnoses);
    };
    void fetchPatientList();

    if (match)
      patientService.getOne(match.params.id!).then((data) => setPatient(data));
  }, [match]);

  if (patients.length === 0) {
    return <div>loading ...</div>;
  }

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
          <Route path="/:id" element={<PatientPage patient={patient!} diagnoses={diagnoses} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
