const bcrypt = require("bcrypt");
const { usersInDb } = require("./test_helper");
const User = require("../models/user");
const mongoose = require("mongoose");

const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = User({ username: "root", passwordHash });

  await user.save();
});

describe("when there is initially one user in the db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "mikoto",
      name: "Misaka Mikoto",
      password: "kamijonobaka",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });
  test("creation fails with a duplicate username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "root",
      name: "root",
      password: "kamijonobaka",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
