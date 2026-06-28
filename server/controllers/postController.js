const Post = require("../models/Post");
const User = require("../models/User");

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
      .populate("creator", "name avatar bio email")
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
        { source: regex },
      ],
    };

    const posts = await Post.find(filter)
      .populate("creator", "name avatar bio email")
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
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("creator", "name avatar bio email");

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      source,
      tags,
      url,
      image,
      category,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.create({
      title,
      description,
      source: source || user.name || user.email,
      tags: Array.isArray(tags)
        ? tags
        : String(tags || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
      url: url || "",
      image: image || "",
      category: category || "Creator",
      creator: user._id,
      publishedAt: new Date(),
    });

    const populatedPost = await Post.findById(post._id).populate("creator", "name avatar bio email");

    return res.status(201).json({ post: populatedPost });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.creator || String(post.creator) !== String(req.userId)) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    const allowedFields = [
      "title",
      "description",
      "source",
      "tags",
      "url",
      "image",
      "category",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = field === "tags" && !Array.isArray(req.body[field])
          ? String(req.body[field])
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : req.body[field];
      }
    });

    post.updatedAt = new Date();
    await post.save();

    const populatedPost = await Post.findById(post._id).populate("creator", "name avatar bio email");
    return res.json({ post: populatedPost });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.creator || String(post.creator) !== String(req.userId)) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    await Post.deleteOne({ _id: post._id });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts, incrementViews, searchPosts, createPost, updatePost, deletePost };