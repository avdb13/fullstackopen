const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { initialNotes, notesInDb } = require("./test_helper");
const Note = require("../models/note");
const User = require("../models/user");

const api = supertest(app);
let token = undefined;

beforeEach(async () => {
  await Note.deleteMany({});
  await User.deleteMany({});

  const [username, name, password] = ["test", "test", "test"];

  let resp = await api
    .post("/api/users")
    .send({ username, name, password })
    .expect(201);
  const savedUser = resp.body;

  const noteObjects = initialNotes
    .map((note) => ({ ...note, user: savedUser.id }))
    .map((note) => new Note(note));

  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);

  resp = await api.post("/api/login").send({ username, password }).expect(200);
  token = resp.body.token;
});

describe("when some notes are initially saved", () => {
  test("notes are returned as json", async () => {
    api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const resp = await api.get("/api/notes");

    expect(resp.body).toHaveLength(initialNotes.length);
  });

  test("a specific note is within the returned note", async () => {
    const resp = await api.get("/api/notes");

    const contents = resp.body.map((note) => note.content);
    expect(contents).toContain("Browser can execute only JavaScript");
  });
});

describe("viewing a specific note", () => {
  test("a valid note can be viewed", async () => {
    const notesAtStart = await notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultNote.body).toEqual(noteToView);
  });
  test("an invalid note cannot be viewed", async () => {
    const id = "5a3d5da59070081a82a3445";
    await api.get(`/api/notes/${id}`).expect(400);
  });
});

describe("addition of a new note", () => {
  test("a valid note can be added", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };

    await api
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await notesInDb();
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).toContain("async/await simplifies making async calls");
  });

  test("an invalid note cannot be added", async () => {
    const newNote = {
      important: true,
    };

    await api
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send(newNote)
      .expect(400);

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(initialNotes.length);
  });
});

describe("deletion of a new note", () => {
  test("a note can be deleted", async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(initialNotes.length - 1);

    const contents = notesAtEnd.map((n) => n.content);

    expect(contents).not.toContain(noteToDelete.contents);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
