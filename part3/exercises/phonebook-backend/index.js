const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const url = "mongodb://localhost:27017/contacts";
const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// initialization
mongoose.connect(url).catch((e) => console.log(`something went wrong: ${e}}`));

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set("toJSON", {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString();
    delete retObject._id;
    delete retObject.__v;
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const errorHandler = (err, req, resp, next) => {
  console.log(err.message);

  if (err.name === "TypeError") {
    return resp.status(400).json({ error: "malformed body" });
  }

  next(err);
};

app.get("/api/contacts", (req, resp) => {
  Contact.find({}).then((contacts) => {
    resp.json(contacts);
  });
});

app.get("/api/contacts/:id", (req, resp, next) => {
  const id = req.params.id;

  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        resp.status(404).end();
      }
      resp.json(contact);
    })
    .catch((e) => next(e));
});

app.post("/api/contacts", (req, resp, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    // how to pass this to the error handler?
    resp.status(400).json({ error: "body missing or malformed" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((newContact) => {
    resp.json(newContact);
  });
});

app.put("/api/contacts/:id", (req, resp, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name || !body.number) {
    return resp.status(400).json({ error: "body missing or malformed" });
  }

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(id, contact, { new: true })
    .then((newContact) => {
      resp.json(newContact);
    })
    .catch((e) => next(e));
});

app.delete("/api/contacts/:id", (req, resp, next) => {
  const id = req.params.id;

  Contact.findOneAndRemove(id)
    .then((oldContact) => {
      console.log(`contact with ID ${id} removed`);
      resp.status(204).end();
    })
    .catch((e) => next(e));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
