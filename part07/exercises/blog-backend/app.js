const _ = require("express-async-errors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const blogRouter = require("./controllers/blogs");
const testingRouter = require("./controllers/testing");
const middleware = require("./utils/middleware");

const cors = require("cors");
const express = require("express");
const bodyParserErrorHandler = require("express-body-parser-error-handler");
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
app.use(bodyParserErrorHandler());

app.use(middleware.requestLogger());

app.use("/api/blogs", blogRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
