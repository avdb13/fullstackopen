const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, resp, next) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  resp.status(201).json(savedUser);
});

usersRouter.get("/", async (req, resp) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
  });
  resp.json(users);
});

module.exports = usersRouter;
