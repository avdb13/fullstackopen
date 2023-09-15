require("express-async-errors");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/api/blogs", async (req, resp) => {
  const blogs = await Blog.find({});
  resp.json(blogs);
});

blogRouter.post("/api/blogs", async (req, resp, next) => {
  const blog = new Blog(req.body);

  const result = await blog.save();
  if (result) {
    resp.status(201).json(result);
  }
  resp.status(400).end();
});

blogRouter.put("/api/blogs/:id", async (req, resp, next) => {
  const id = req.params.id;
  const { likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    {
      runValidators: true,
      new: true,
      context: "query",
    },
  );

  resp.json(updatedBlog);
});

blogRouter.delete("/api/blogs/:id", async (req, resp, next) => {
  const id = req.params.id;

  await Blog.findByIdAndRemove(id);
  resp.status(204).end();
});

module.exports = blogRouter;
