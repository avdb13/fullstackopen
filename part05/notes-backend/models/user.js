const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    match: /[a-zA-Z0-9]{4,}/,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString();
    delete retObject._id;
    delete retObject.__v;
    delete retObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
