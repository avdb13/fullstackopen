import express, { Request } from "express";
import cors from "cors"
import diagnoseRouter from "./services/diagnoses";

const app = express()
app.use(cors<Request>())
// app.use(express.json())
//
app.use("/api/diagnoses", diagnoseRouter)

app.get('/api/ping', (_req, resp) => {
  resp.send('pong')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
