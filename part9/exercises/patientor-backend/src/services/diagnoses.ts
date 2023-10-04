import express from "express"
import { getDiagnoses } from '../services/diagnoseService'

const router = express.Router()

router.get('/', (_req, resp) => {
  resp.send(getDiagnoses())
})

export default router
