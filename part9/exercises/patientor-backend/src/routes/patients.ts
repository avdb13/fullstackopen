import express, { Router } from "express";
const router: Router = express.Router();
import patientService from "../services/patientService";

router.get("/", (_req, resp) => {
  resp.send(patientService.getNonSensitivePatients());
});

export default router;
