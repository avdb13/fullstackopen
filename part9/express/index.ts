import express, { Request, Response } from 'express'
const app = express()

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

const PORT: number = 3000

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
