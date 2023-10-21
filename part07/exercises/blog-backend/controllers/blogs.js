const jwt = require("jsonwebtoken");
const _ = require("express-async-errors");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (req, resp) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments.author", { name: 1 })

  resp.json(blogs);
});

blogRouter.get("/:id", async (req, resp) => {
  const id = req.params.id;
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });

  resp.json(blog);
});

blogRouter.post("/", userExtractor, async (req, resp, next) => {
  const body = req.body;

  if (!req.user) {
    resp.status(401).json({ error: "missing bearer token" });
    return;
  }

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

blogRouter.post("/:id/comments", userExtractor, async (req, resp, next) => {
  const id = req.params.id;
  const { body, token } = req.body;

  if (!body) {
    resp.status(400).json({ error: "malformed body" });
    return;
  }

  const author = req.user ? req.user : null
  console.log(author)
  const comment = { body, added: new Date(), author }

  const { comments } = await Blog.findByIdAndUpdate(
    id,
    { $push: { comments: comment } },
    {
      runValidators: true,
      new: true,
      context: "query",
    },
  ).populate("comments.author", {
    name: 1,
  });

  // silly hack to get the latest commment
  resp.status(201).json(comments[comments.length-1]);
});

blogRouter.post("/:id/like", async (req, resp, next) => {
  const id = req.params.id;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      {
        runValidators: true,
        new: true,
        upsert: true,
        context: "query",
      },
    );

    resp.status(201).json(updatedBlog);
  } catch(e) {
    resp.status(400).json({ error: "unknown blog id" });
  }

});

blogRouter.put("/:id", async (req, resp, next) => {
  const id = req.params.id;
  const blog = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    runValidators: true,
    new: true,
    context: "query",
  });

  resp.json(updatedBlog);
});

blogRouter.delete("/:id", userExtractor, async (req, resp, next) => {
  const id = req.params.id;

  const blog = await Blog.findById(id);

  if (!req.user) {
    resp.status(401).json({ error: "missing bearer token" });
    return;
  }

  if (blog.user.toString() !== req.user) {
    return resp
      .status(401)
      .json({ error: "you can only delete your own blogs" });
  }

  resp.status(204).end();
});

module.exports = blogRouter;
