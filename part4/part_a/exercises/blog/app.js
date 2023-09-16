const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");

const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();

mongoose.set("strictQuery", true);
logger.info(`connecting to ${config.MONGODB_URI}`);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((e) => logger.error(`something went wrong: ${e}`));

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(blogRouter);

module.exports = app;
