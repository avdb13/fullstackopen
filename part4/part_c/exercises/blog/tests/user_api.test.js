const mongoose = require("mongoose");
const config = require("../utils/config");
const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);
const { blogsInDb, initialBlogs } = require("./blog_helper");

const User = require("../models/user");
const Blog = require("../models/blog");

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
  console.log("connected to MongoDB", mongoose.connection.readyState);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
});

describe("creating users", () => {
  test("username must be unique", async () => {
    const userOne = {
      username: "test",
      name: "jest",
      password: "nest",
    };

    await api.post("/api/users").send(userOne).expect(201);

    const userTwo = {
      username: "test",
      name: "test",
      password: "test",
    };

    // strange bug where await across two points doesn't work.
    resp = api
      .post("/api/users")
      .send(userTwo)
      .expect(400)
      .then(() =>
        expect(resp.body.error).toContain("expected `username` to be unique"),
      );
  }, 15000);

  test("password must be at least 3 characters long", async () => {
    const newUser = {
      username: "test",
      name: "test",
      password: "tes",
    };

    const resp = await api.post("/api/users").send(newUser).expect(400);
    expect(resp.body).toEqual({
      error: "password must be at least 3 characters long",
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
