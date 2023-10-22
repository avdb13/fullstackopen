// node mongo.js Anna 040-1234556
//
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/phonebook?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 2) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });

    mongoose.connection.close();
  });
} else if (process.argv.length === 4) {
  const contact = new Contact({
    name: process.argv[2],
    number: process.argv[3],
  });

  contact.save().then(() => {
    console.log(`created new contact: [${contact.name} ${contact.number}]`);

    mongoose.connection.close();
  });
} else {
  console.log("USAGE: node mongo.js [contact] [phone number]");
  process.exit(1);
}
