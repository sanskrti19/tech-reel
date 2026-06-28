const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  source: String,
  category: String,
  url: String,
  image: String,

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  views: {
  type: Number,
  default: 0,
},

  tags: [String],

  content: String,

  aiSummary: String,

  publishedAt: Date,

  updatedAt: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);