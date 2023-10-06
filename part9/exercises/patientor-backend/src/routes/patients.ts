import express, { Router } from "express";
const router: Router = express.Router();
import patientService from "../services/patientService";
import { toNewPatient } from "../validators";

router.get("/", (_req, resp) => {
  resp.send(patientService.getAllNonSensitivePatients());
});

router.get("/:id", (req, resp) => {
  const id = req.params.id;
  resp.send(patientService.getNonSensitivePatient(id));
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

export default router;
