const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    default: function () {
      return this.email ? this.email.split("@")[0] : "Creator";
    }
  },

  avatar: {
    type: String,
    default: ""
  },

  bio: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  savedFacts: [
    {
      id: Number,
      title: String,
      description: String,
      bg: String,
      url: String
    }
  ],

  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports =
  mongoose.model("User", userSchema)