const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contacts')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const errorHandler = (err, req, resp, next) => {
  console.log(err)

  if (err.name === 'TypeError') {
    return resp.status(400).json({ error: 'malformed body' })
  } else if (err.name === 'ValidationError') {
    console.log('properly handled error')
    return resp.status(400).json({ error: err.message })
  }

  next(err)
}

app.get('/api/contacts', (req, resp) => {
  Contact.find({}).then((contacts) => {
    resp.json(contacts)
  })
})

app.get('/api/contacts/:id', (req, resp, next) => {
  const id = req.params.id

  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        resp.status(404).end()
      }
      resp.json(contact)
    })
    .catch((e) => next(e))
})

app.post('/api/contacts', (req, resp, next) => {
  const body = req.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact
    .save()
    .then((newContact) => {
      resp.json(newContact)
    })
    .catch((e) => next(e))
})

app.put('/api/contacts/:id', (req, resp, next) => {
  const id = req.params.id
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(id, contact, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((newContact) => {
      resp.json(newContact)
    })
    .catch((e) => next(e))
})

app.delete('/api/contacts/:id', (req, resp, next) => {
  const id = req.params.id

  Contact.findOneAndRemove(id)
    .then((oldContact) => {
      console.log(`contact with ID ${id} removed`)
      resp.status(204).end()
    })
    .catch((e) => next(e))
})

app.use(errorHandler)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
