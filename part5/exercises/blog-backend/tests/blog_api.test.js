const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user");

const app = require("../app");
const api = supertest(app);
const { blogsInDb, initialBlogs } = require("./blog_helper");

const Blog = require("../models/blog");

let token = undefined;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const [username, name, password] = ["test", "test", "test"];

  const user = { name, username, password };
  let resp = await api.post("/api/users").send(user).expect(201);

  const blogObjects = initialBlogs.map(
    (blog) => new Blog({ ...blog, user: resp.body.id }),
  );
  const blogs = blogObjects.map((blog) => blog.save());
  await Promise.all(blogs);

  resp = await api.post("/api/login").send({ username, password }).expect(200);
  token = resp.body.token;
});

describe("viewing blogs", () => {
  test("correct amount of blog posts in the JSON format", async () => {
    const blogsAtStart = await blogsInDb();

    const resp = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resp.body).toHaveLength(blogsAtStart.length);
  });

  test("verifies that the unique identifier of the blog posts is named id", async () => {
    const resp = await api.get("/api/blogs");

    const set = [...new Set(resp.body.map((blog) => blog.id))];

    expect(set).toHaveLength(resp.body.length);
    resp.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("creating and modifying blogs", () => {
  test("POST request to /api/blogs successfully creates a new blog", async () => {
    const newBlog = {
      title: "systemd considered harmful",
      author: "Linus Torvalds",
      url: "https://nosystemd.org",
      likes: 123,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("systemd considered harmful");
  });

  test("malformed body returns bad request", async () => {
    const newBlogs = [
      {
        author: "Linus Torvalds",
        url: "https://nosystemd.org",
        likes: 123,
      },
      {
        author: "Richard Stallman",
        title: "systemd considered proprietary",
        likes: 321,
      },
    ];

    const resps = newBlogs.map((blog) =>
      api
        .post("/api/blogs")
        .send(blog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400),
    );
    await Promise.all(resps);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);

    const authors = blogsAtEnd.map((blog) => blog.author);
    expect(authors).not.toContain("Linus Torvalds");
    expect(authors).not.toContain("Richard Stallman");
  });

  // NOTE: impossible to implement these since `beforeAll` ends up
  // in infinite idling even when setting a timeout on the function.
  // Therefore we are forced to delete and recreate the user on every
  // test which makes testing update and delete impossible.

  test("we can update our own blogs", async () => {
    const blogsAtStart = await blogsInDb();
    const idx = Math.floor(Math.random() * blogsAtStart.length);
    const blog = blogsAtStart[idx];

    const newBlog = { ...blog, likes: blog.likes + 5 };

    const resp = await api
      .put(`/api/blogs/${blog.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(200);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd[idx].likes).toEqual(blog.likes + 5);
  });

  test("we can delete our own blogs", async () => {
    const blogsAtStart = await blogsInDb();
    const idx = Math.floor(Math.random() * blogsAtStart.length);
    const blog = blogsAtStart[idx];

    const resp = await api
      .delete(`/api/blogs/${blog.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await blogsInDb();

    expect(blogsAtEnd).toContainEqual(blog);
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
