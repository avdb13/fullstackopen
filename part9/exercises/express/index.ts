import express, { Request, Response } from "express";

const app = express()

app.get('/hello', (_req: Request, resp: Response) => {
  resp.send('Hello Full Stack!')
})

const PORT = 3000
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
