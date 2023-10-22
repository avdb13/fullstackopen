const mongoose = require("mongoose");
const config = require("../utils/config");

module.exports = async () => {
  mongoose.connect(config.MONGODB_URI);
};
