import express from "express";
const app = express()
// app.use(express.json())

app.get('/api/ping', (_req, resp) => {
  resp.send('pong')
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
