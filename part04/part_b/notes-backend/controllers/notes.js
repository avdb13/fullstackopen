require("express-async-errors");

const notesRouter = require("express").Router();

const Note = require("../models/note");

notesRouter.get("/", async (req, resp) => {
  const notes = await Note.find({});
  resp.json(notes);
});

notesRouter.get("/:id", async (req, resp, next) => {
  const id = req.params.id;

  const note = await Note.findById(id);

  if (!note) {
    resp.status(404).end();
  }

  resp.json(note);
});

notesRouter.post("/", async (req, resp, next) => {
  const body = req.body;

  const note = Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  resp.status(201).json(savedNote);
});

notesRouter.put("/:id", async (req, resp, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" },
  );
  resp.json(updatedNote);
});

notesRouter.delete("/:id", async (req, resp, next) => {
  const id = req.params.id;

  const note = await Note.findByIdAndRemove(id);
  resp.status(204).end();
});

module.exports = notesRouter;
