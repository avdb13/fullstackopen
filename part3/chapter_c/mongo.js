const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/test?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
// const note = new Note({
//   content: "HTML is so easy",
//   important: true,
// });

// note.save(note).then(() => {
//   console.log("created");
//   mongoose.connection.close();
// });
