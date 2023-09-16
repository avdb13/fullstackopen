require("express-async-errors");
const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (req, resp) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  resp.json(blogs);
});

const getTokenFrom = (req) => {
  const auth = req.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  return null;
};

blogRouter.post("/", async (req, resp, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    resp.status(401).json({ error: "invalid bearer token" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = [...user.blogs, savedBlog];
  await user.save();

  resp.status(201).json(savedBlog);
});

blogRouter.put("/:id", async (req, resp, next) => {
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

blogRouter.delete("/:id", async (req, resp, next) => {
  const id = req.params.id;

  await Blog.findByIdAndRemove(id);
  resp.status(204).end();
});

module.exports = blogRouter;
