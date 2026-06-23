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
        filter._id = { $nin: excludeIds };
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

// New searchPosts controller – case‑insensitive regex across title, description, category, source
const searchPosts = async (req, res) => {
  try {
    const q = req.query.q || "";
    const regex = { $regex: q, $options: "i" };
    const filter = {
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { source: regex },
      ],
    };
    const posts = await Post.find(filter).sort({ publishedAt: -1 }).exec();
    res.json({ posts, hasMore: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
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