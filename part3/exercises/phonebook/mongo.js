// node mongo.js Anna 040-1234556
//
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/phonebook?retryWrites=true&w=majority";

if (process.argv.length < 4) {
  console.log("USAGE: node mongo.js [contact] [phone number]");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  name: process.argv[2],
  number: process.argv[3],
});

contact.save().then(() => {
  console.log(`created new contact: [${contact.name} ${contact.number}]`);
  mongoose.connection.close();
});
