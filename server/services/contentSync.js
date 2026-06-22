const Post = require("../models/Post");
 const { fetchAllRSSPosts } = require("./rss");
 

// TEMPORARY
const fetchDevtoPosts = async () => {
  return [];
};

const syncContent = async () => {
  const devtoPosts = await fetchDevtoPosts();
  const rssPosts = await fetchAllRSSPosts();

  const allPosts = [
  ...devtoPosts,
  ...rssPosts,
];

  for (const post of allPosts) {
    const exists = await Post.findOne({
      url: post.link || post.url,
    });

    if (!exists) {
       await Post.create({
  title: post.title,
  description: post.description,
  source: post.source,
  url: post.url,
  publishedAt: post.publishedAt,
});
    }
  }

  return allPosts.length;
};

module.exports = {
  syncContent,
};