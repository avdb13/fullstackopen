const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Note = require("./models/note");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// app.use(express.static("dist"));

app.get("/api/notes", (req, resp) => {
  Note.find({}).then((notes) => {
    resp.json(notes);
  });
});

app.get("/api/notes/:id", (req, resp, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        resp.status(404).end();
      }
      resp.json(note);
    })
    .catch((e) => next(e));
});

app.post("/api/notes", (req, resp, next) => {
  const body = req.body;

  const note = Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      resp.json(savedNote);
    })
    .catch((e) => next(e));
});

app.put("/api/notes/:id", (req, resp, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedNote) => resp.json(updatedNote))
    .catch((e) => next(e));
});

app.delete("/api/notes/:id", (req, resp, next) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id)
    .then((res) => resp.status(204).end())
    .catch((e) => next(e));
});

const errorHandler = (err, req, resp, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return resp.status(400).json({ error: "malformed id" });
  } else if (err.name === "ValidationError") {
    return resp.status(400).json({ error: err.message });
  }

  next(err);
};

const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
