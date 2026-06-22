const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  source: String,
  url: String,
  image: String,

  tags: [String],

  content: String,

  aiSummary: String,

  publishedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);