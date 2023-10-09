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

    resp.json(addedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) {
      resp.status(400).send(`${e.message}`);
    }
  }
});

router.post("/:id/entries", (req, resp) => {
  try {
    if (!patients.map(p => p.id).includes(req.params.id)) {
      throw new Error("invalid id for entry update")
    }

    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addPatientEntries(req.params.id, newEntry);

    resp.json(addedEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      resp.status(400).send(`${e.message}`);
    }
  }
});

export default router;
