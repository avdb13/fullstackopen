import express, { Request } from "express";
import cors from "cors";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express()
app.use(cors<Request>())
// app.use(express.json())
//
app.use("/api/diagnoses", diagnoseRouter)
app.use("/api/patients", patientRouter)

app.get('/api/ping', (_req, resp) => {
  resp.send('pong')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
