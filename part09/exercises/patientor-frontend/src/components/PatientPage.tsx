import {
  Diagnosis,
  Entry,
  EntryFormValues,
  EntryWithoutId,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../types";
import { Typography, Container, Button } from "@mui/material";
import EntryDetails from "./Entry";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useState } from "react";
import AddDiagnosisModal from "./AddDiagnosisModal";
import patientService from "../services/patients";
import axios from "axios";

const Style = {
  border: "2px solid black",
  borderRadius: "20px",
  margin: "10px",
  padding: "10px",
};

const PatientPage = ({
  patient,
  diagnoses,
  onSuccess,
}: {
  patient: Patient;
  diagnoses: Diagnosis[];
  onSuccess: (patientId: string, newEntry: Entry) => void;
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const gender = patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />;
  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (object: EntryFormValues) => {
    try {
      const { patientId, ...entry } = object;

      const castEntry = (entry: EntryWithoutId): EntryWithoutId => {
        switch (entry.type) {
          case "HealthCheck":
            return entry as HealthCheckEntry;
          case "OccupationalHealthcare":
            return entry as OccupationalHealthcareEntry;
          case "Hospital":
            return entry as HospitalEntry;
        }
      };

      const newEntry = await patientService.addEntry(castEntry(entry), patientId);
      onSuccess(patient.id, newEntry);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          setError(e.response.data);
        } else if ((e?.response?.data && Array.isArray(e?.response?.data))) {
          setError(e.response.data.map(e => e.message).join("\n"));
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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
          <div style={Style} key={entry.id}>
            <EntryDetails entry={entry} diagnoses={diagnoses} />
          </div>
        ))}
        <AddDiagnosisModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
          patientId={patient.id}
        />
        <Button variant="contained" onClick={() => openModal()}>
          Add New Entry
        </Button>
      </Container>
    </div>
  );
};

export default PatientPage;
