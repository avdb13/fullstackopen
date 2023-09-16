const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, resp) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  resp.status(201).send(savedUser);
});

usersRouter.get("/", async (req, resp) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  resp.json(users);
});

module.exports = usersRouter;
