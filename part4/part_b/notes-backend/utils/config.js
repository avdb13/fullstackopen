require("dotenv").config();

const PORT = process.env.PORT === undefined ? 3000 : process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.TEST_MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};
