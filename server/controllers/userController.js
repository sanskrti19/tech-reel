const User = require("../models/User");
const Post = require("../models/Post");

const buildProfile = async (userId, viewerId) => {
  const user = await User.findById(userId).lean();
  if (!user) return null;

  const createdPosts = await Post.find({ creator: user._id })
    .populate("creator", "name avatar bio email")
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  const isOwner = viewerId && String(viewerId) === String(user._id);
  const followersCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;
  const viewer = viewerId ? await User.findById(viewerId).lean() : null;
  const isFollowing = viewer ? (viewer.following || []).some((id) => String(id) === String(user._id)) : false;
  const savedPosts = isOwner
    ? await Post.find({ _id: { $in: user.savedPosts || [] } })
        .populate("creator", "name avatar bio email")
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean()
    : [];

  return {
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      joinedAt: user.createdAt,
      postsCount: createdPosts.length,
      savedPostsCount: user.savedPosts?.length || 0,
      followersCount,
      followingCount,
      isFollowing,
      isOwner,
    },
    createdPosts,
    savedPosts,
  };
};

const getProfile = async (req, res) => {
  try {
    const targetUserId = req.query.userId || req.userId;
    const payload = await buildProfile(targetUserId, req.userId);

    if (!payload) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { name, bio, avatar } = req.body;
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const profile = await buildProfile(user._id, user._id);
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCreator = async (req, res) => {
  try {
    const payload = await buildProfile(req.params.id, req.userId);
    if (!payload) {
      return res.status(404).json({ message: "Creator not found" });
    }

    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const toggleFollow = async (req, res) => {
  try {
    const targetId = req.params.id;
    const viewerId = req.userId;

    if (String(targetId) === String(viewerId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const [viewer, target] = await Promise.all([
      User.findById(viewerId),
      User.findById(targetId),
    ]);

    if (!viewer || !target) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = viewer.following.some((id) => String(id) === String(targetId));

    if (isFollowing) {
      viewer.following = viewer.following.filter((id) => String(id) !== String(targetId));
      target.followers = target.followers.filter((id) => String(id) !== String(viewerId));
    } else {
      viewer.following.push(target._id);
      target.followers.push(viewer._id);
    }

    await Promise.all([viewer.save(), target.save()]);

    const payload = await buildProfile(targetId, viewerId);
    return res.json(payload);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const posts = await Post.find({ creator: user._id })
      .select("title views image source description createdAt tags creator")
      .populate("creator", "name avatar email")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalSaves = await Post.countDocuments({ _id: { $in: user.savedPosts || [] } });

    return res.json({
      totalPosts,
      totalViews,
      totalSaves,
      posts,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getCreator,
  toggleFollow,
  getAnalytics,
};