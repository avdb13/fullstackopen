const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);
const { blogsInDb, initialBlogs } = require("./blog_helper");

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const blogs = blogObjects.map((blog) => blog.save());
  await Promise.all(blogs);
});

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

test("POST request to /api/blogs successfully creates a new blog", async () => {
  const newBlog = {
    title: "systemd considered harmful",
    author: "Linus Torvalds",
    url: "https://nosystemd.org",
    likes: 123,
  };

  await api
    .post("/api/blogs")
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
    api.post("/api/blogs").send(blog).expect(400),
  );
  await Promise.all(resps);

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialBlogs.length);

  const authors = blogsAtEnd.map((blog) => blog.author);
  expect(authors).not.toContain("Linus Torvalds");
  expect(authors).not.toContain("Richard Stallman");
});

test("a valid blog can be deleted", async () => {
  const blogsAtStart = await blogsInDb();
  const idx = Math.floor(Math.random() * blogsAtStart.length);
  const blog = blogsAtStart[idx];

  await api.delete(`/api/blogs/${blog.id}`).expect(204);

  const blogsAtEnd = await blogsInDb();

  expect(blogsAtEnd).not.toContain(blog);
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
});

test("a valid blog can be updated", async () => {
  const blogsAtStart = await blogsInDb();
  let blog = blogsAtStart[0];

  const updatedBlog = await api
    .put(`/api/blogs/${blog.id}`)
    .send({ ...blog, likes: blog.likes + 5 });

  const blogsAtEnd = await blogsInDb();
  expect(blogsAtEnd[0].likes).toEqual(blogsAtStart[0].likes + 5);
});

afterAll(async () => {
  await mongoose.connection.close();
});
