import express, { Router } from "express";
const router: Router = express.Router();
import diagnoseService from "../services/diagnoseService";

router.get("/", (_req, resp) => {
  resp.send(diagnoseService.getAllDiagnoses());
});

export default router;
