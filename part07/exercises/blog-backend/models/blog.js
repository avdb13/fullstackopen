const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  added: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  }
})

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  author: String,
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  comments: {
    type: [commentSchema],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString();
    delete retObject._id;
    delete retObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
