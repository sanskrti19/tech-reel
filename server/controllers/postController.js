const Post = require("../models/Post");

// Existing getPosts controller – pagination with optional exclude IDs
const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const exclude = req.query.exclude;

    const filter = {};
    if (exclude) {
      const excludeIds = exclude.split(",").filter(id => id.trim() !== "");
      if (excludeIds.length > 0) {
         const mongoose = require("mongoose");

      filter._id = {
     $nin: excludeIds.map(
       id => new mongoose.Types.ObjectId(id)
       )
    };
      }
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

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

 const searchPosts = async (req, res) => {
  try {

    const q = req.query.q || "";

    if (!q.trim()) {
      return res.json({
        posts: [],
        hasMore: false
      });
    }

    const regex = {
      $regex: q,
      $options: "i"
    };

    const filter = {
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { source: regex },
      ],
    };

    const posts = await Post.find(filter)
      .sort({ publishedAt: -1 })
      .exec();

    res.json({
      posts,
      hasMore: false
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

// Existing incrementViews controller – increments view count for a post
const incrementViews = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts, incrementViews, searchPosts };