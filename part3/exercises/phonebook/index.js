const morgan = require("morgan");
const express = require("express");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, resp) => {
  resp.json(persons);
});

app.get("/api/persons/:id", (req, resp) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    resp.json(person);
  } else {
    resp.status(404).send("no note found").end();
  }
});

app.post("/api/persons", (req, resp) => {
  const body = req.body;
  console.log(body);

  if (!body.name) {
    return resp.status(400).json({ error: "body missing or malformed" });
  } else if (persons.find((p) => p.name === body.name)) {
    return resp.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: Number(body.number),
    id: Math.floor(Math.random() * 1000),
  };

  persons = [...persons, person];
  resp.json(person);
});

app.delete("/api/persons/:id", (req, resp) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id === id);

  resp.status(204).end();
});

app.get("/info", (req, resp) => {
  const date = new Date();
  const payload = `
    <p>phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `;

  resp.send(payload);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
