require("express-async-errors");
const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (req, resp) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  resp.json(blogs);
});

blogRouter.post("/", userExtractor, async (req, resp, next) => {
  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: req.user.toString(),
  });

  const user = await User.findById(req.user);

  const savedBlog = await blog.save();
  user.blogs = [...user.blogs, savedBlog];
  await user.save();

  resp.status(201).json(savedBlog);
});

blogRouter.put("/:id", userExtractor, async (req, resp, next) => {
  const id = req.params.id;
  const { likes } = req.body;

  const blog = await Blog.findById(id);

  if (blog.user.toString() !== req.user) {
    return resp
      .status(401)
      .json({ error: "you can only update your own blogs" });
  }

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

blogRouter.delete("/:id", userExtractor, async (req, resp, next) => {
  const id = req.params.id;

  const blog = await Blog.findById(id);

  if (blog.user.toString() !== req.user) {
    return resp
      .status(401)
      .json({ error: "you can only delete your own blogs" });
  }

  Blog.findByIdAndDelete(id);

  resp.status(204).end();
});

module.exports = blogRouter;
