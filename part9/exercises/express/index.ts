import express, { Request, Response } from "express";
import { calculator } from "./bmiCalculator";

const app = express()

app.get('/hello', (_req: Request, resp: Response) => {
  resp.send('Hello Full Stack!')
})

app.get('/bmi', express.json(), (req: Request, resp: Response) => {
  const weight = req.query.weight
  const height = req.query.height
  if (!isNaN(Number(weight)) && !isNaN(Number(height))) {
    const result = calculator(Number(weight), Number(height))
    resp.json({ weight: Number(weight), height: Number(height), result })
  } else {
    resp.send({ error: 'weight and height must be numbers'})
  }
})

const PORT = 3000
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
