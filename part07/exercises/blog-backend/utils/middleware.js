const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("auth-header", (req) => JSON.stringify(req.headers.authorization));

const requestLogger = (req, resp) => {
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :body :auth-header",
  );
};

const unknownEndpoint = (req, resp, next) => {
  resp.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, resp, next) => {
  if (err.name === "CastError") {
    console.log(err)
    return resp.status(400).json({ error: "malformed id" });
  } else if (err.name) {
    return resp.status(400).json({ error: err.message });
  }
  // } else if (err.name === "ValidationError") {
  //   return resp.status(400).json({ error: err.message });
  // } else if (err.name === "JsonWebTokenError") {
  //   return resp.status(400).json({ error: err.message });
  // }

  next(err);
};

const userExtractor = async (req, resp, next) => {
  const auth = req.get("Authorization");

  if (!(auth && auth.startsWith("Bearer "))) {
    resp.status(401).json({ error: "missing bearer token" });
  }

  const token = auth.replace("Bearer ", "");
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    resp.status(401).json({ error: "invalid bearer token" });
  }

  const user = await User.findById(decodedToken.id);
  req.user = user._id.toString();

  next();
};

module.exports = {
  unknownEndpoint,
  userExtractor,
  errorHandler,
  requestLogger,
};
