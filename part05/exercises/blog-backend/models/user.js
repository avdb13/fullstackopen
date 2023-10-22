const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    match: /[a-zA-Z0-9]{3,}/,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(mongooseUniqueValidator);

userSchema.set("toJSON", {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString();
    delete retObject._id;
    delete retObject.__v;
    delete retObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
