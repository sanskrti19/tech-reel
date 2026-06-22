const Post = require("../models/Post");

const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      hasMore: skip + posts.length < total,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const incrementViews = async (req, res) => {
  try {

    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 }
      }
    );

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {
  getPosts, incrementViews,
};