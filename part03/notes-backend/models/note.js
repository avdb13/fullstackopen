const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/test";
mongoose
  .connect(url)
  .catch((e) =>
    console.log(`something went wrong connecting to MongoDB: ${e}`),
  );

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Note.find({ id }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
// const note = new Note({
//   content: "HTML is so easy",
//   important: true,
// });

// note.save(note).then(() => {
//   console.log("created");
//   mongoose.connection.close();
// });
//
module.exports = mongoose.model("Note", noteSchema);
