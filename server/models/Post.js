const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  source: String,
  url: String,
  image: String,

  views: {
  type: Number,
  default: 0,
},

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