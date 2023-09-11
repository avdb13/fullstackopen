const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: "unknown endpoint" });
};

let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, resp) => {
  resp.send("<h1>Hello, world!</h1>");
});

app.get("/api/notes", (req, resp) => {
  resp.json(notes);
});

app.get("/api/notes/:id", (req, resp) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (note) {
    resp.json(note);
  } else {
    resp.status(404).send("no note found").end();
  }
});

const genId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  return maxId + 1;
};

app.post("/api/notes", (req, resp) => {
  const body = req.body;

  if (!body.content) {
    return resp.status(400).json({ error: "content missing" });
  }

  console.log(body);

  const note = {
    content: body.content,
    important: body.important || false,
    id: genId(),
  };

  notes = [...notes, note];
  resp.json(note);
});

app.put("/api/notes/:id", (req, resp) => {
  const id = Number(req.params.id);
  const body = req.body;

  if (!notes.find((n) => n.id === id)) {
    return resp.status(400).json({ error: "content missing" });
  }

  console.log(body);

  const note = {
    content: body.content,
    important: body.important || false,
    id,
  };

  notes = notes.map((n) => (n.id === id ? note : n));

  resp.json(note);
});

app.delete("/api/notes/:id", (req, resp) => {
  const id = Number(req.params.id);
  const note = notes.filter((n) => n.id !== id);

  resp.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
