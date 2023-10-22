const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");
const { z, ZodError } = require("zod");

const blogSchema = z.object({
  title: z.string({ required_error: "blog is missing title" }),
  author: z.string({ required_error: "blog is missing author" }),
  url: z.string({ required_error: "blog is missing URL" }).url(),
  user: z.string(),
});

blogRouter.get("/", async (req, resp) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments.author", { name: 1 });

  resp.json(blogs);
});

blogRouter.get("/:id", async (req, resp) => {
  const id = req.params.id;

  const blog = await Blog.findById(id)
    .populate("user", { username: 1, name: 1 })
    .populate("comments.author", { name: 1 });

  resp.json(blog);
});

blogRouter.post("/", userExtractor, async (req, resp, next) => {
  const body = req.body;

  if (!req.user) {
    resp.status(401).json({ error: "missing bearer token" });
    return;
  }

  if (!body.title || !body.url || !body.author) {
    resp.status(401).json({ error: "missing fields" });
    return;
  }

  try {
    const blog = await blogSchema.parseAsync({
      title: body.title,
      url: body.url,
      author: body.author,
      user: req.user.toString(),
    });

    const newBlog = new Blog(blog);

    const user = await User.findById(req.user);

    const savedBlog = await newBlog.save();
    user.blogs = [...user.blogs, savedBlog];
    await user.save();

    resp.status(201).json(savedBlog);
  } catch (e) {
    if (e instanceof ZodError) {
      // only first error matters, if the user fixes it and resubmits
      // the form he can find out for himself what else is wrong
      const error = `${e.issues[0].path}: ${e.issues[0].message}`;
      resp.status(401).json({ error });
    } else {
      resp.status(401).json({ error: e.message });
    }
  }
});

blogRouter.post("/:id/comments", userExtractor, async (req, resp, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.body) {
    resp.status(400).json({ error: "missing fields" });
    return;
  }

  if (!(body.body instanceof String || typeof body.body === 'string')) {
    resp.status(400).json({ error: "body must be string" });
    return;
  }

  const author = req.user ? req.user : null;
  const comment = { body, added: new Date(), author };

  try {
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
    resp.status(201).json(comments[comments.length - 1]);
  } catch(e) {
    resp.status(404).json({ error: e.message });
  }

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
  } catch (e) {
    resp.status(400).json({ error: e.message });
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
    resp
      .status(401)
      .json({ error: "you can only delete your own blogs" });
    return;
  }

  resp.status(204).end();
});

module.exports = blogRouter;
