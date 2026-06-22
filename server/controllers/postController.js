const Post = require("../models/Post");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ publishedAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getPosts,
};