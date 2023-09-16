const notesRouter = require("express").Router();

const Note = require("../models/note");

notesRouter.get("/", (req, resp) => {
  Note.find({}).then((notes) => {
    resp.json(notes);
  });
});

notesRouter.get("/:id", (req, resp, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        resp.status(404).end();
      }
      resp.json(note);
    })
    .catch(next);
});

notesRouter.post("/", (req, resp, next) => {
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
    .catch(next);
});

notesRouter.put("/:id", (req, resp, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedNote) => resp.json(updatedNote))
    .catch(next);
});

notesRouter.delete("/:id", (req, resp, next) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id)
    .then((res) => resp.status(204).end())
    .catch(next);
});

module.exports = notesRouter;
