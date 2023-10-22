const morgan = require("morgan");

morgan.token("body", (req) => JSON.stringify(req.body));

const requestLogger = (req, resp) => {
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
  );
};

const unknownEndpoint = (req, resp, next) => {
  resp.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, resp, next) => {
  if (err.name === "CastError") {
    return resp.status(400).json({ error: "malformed body" });
  } else if (err.name === "ValidationError") {
    return resp.status(400).json({ error: err.message });
  } else if (err.name === "JsonWebTokenError") {
    return resp.status(401).json({ error: err.message });
  } else if (err.name === "TokenExpiredError") {
    return resp.status(401).json({ error: "token expired" });
  }

  next(err);
};

module.exports = { unknownEndpoint, errorHandler, requestLogger };
