import express, { Router } from "express";
import patients from "../data/patients";
const router: Router = express.Router();
import patientService from "../services/patientService";
import { toNewEntry, toNewPatient } from "../validators";

router.get("/", (_req, resp) => {
  resp.send(patientService.getAllNonSensitivePatients());
});

router.get("/:id", (req, resp) => {
  const id = req.params.id;
  resp.send(patientService.getPatient(id));
});

router.post("/", (req, resp) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);

    resp.status(200).send(addedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) {
      resp.status(400).send(`${e.message}`);
    }
  }
});

router.post("/:id/entries", (req, resp) => {
  try {
    if (!patients.map(p => p.id).includes(req.params.id)) {
      resp.status(404).send("invalid id for entry update");
    }

    const entry = toNewEntry(req.body);
    const newEntry = patientService
      .addPatientEntries(req.params.id, entry);

    resp.status(200).send(newEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      resp.status(400).send(`${e.message}`);
    } else {
      resp.status(400).send(`${e}`);
    }
  }
});

export default router;
