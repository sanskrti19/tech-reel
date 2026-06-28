const User = require("../models/User");
const Post = require("../models/Post");

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("savedPosts", "title source image description url views")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ posts: user.savedPosts || [] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { postId } = req.params;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedPosts.some(
      (id) => String(id) === String(postId)
    );

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => String(id) !== String(postId)
      );
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    return res.json({
      saved: !alreadySaved
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedPosts = user.savedPosts.filter(
      (id) => String(id) !== String(postId)
    );

    await user.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBookmarks,
  toggleBookmark,
  removeBookmark
};
