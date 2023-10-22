import express, { type Request, type Response } from 'express'
import { Operation, calculator } from './calculator'
const app = express()

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

app.post('/calculate', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { val1, val2, op } = req.body

  if (!val1 || isNaN(Number(val1)) && !val2 || isNaN(Number(val2))) {
    return res.status(400).send({ error: '...'})
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(val1), Number(val2), op as Operation)

  return res.send({ result })
})

const PORT: number = 3000

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
