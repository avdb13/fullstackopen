const User = require("../models/user");
const Note = require("../models/note");
const jwt = require("jsonwebtoken");
require("express-async-errors");

const notesRouter = require("express").Router();

notesRouter.get("/", async (req, resp) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
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

const getTokenFrom = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }

  return null;
};

notesRouter.post("/", async (req, resp, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return resp.status(401).json({ error: "invalid bearer token" });
  }

  const user = await User.findById(decodedToken.id);

  const note = Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  const savedNote = await note.save();
  // _id instead of id because we're inside the API
  user.notes = [...user.notes, savedNote._id];
  await user.save();

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
