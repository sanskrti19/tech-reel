const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

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
  ]

})

module.exports =
  mongoose.model("User", userSchema)