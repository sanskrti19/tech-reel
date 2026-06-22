const Parser = require("rss-parser");

const parser = new Parser();

const feeds = [
  {
    url: "https://react.dev/rss.xml",
    source: "React Blog",
  },
  {
    url: "https://nodejs.org/en/feed/blog.xml",
    source: "Node.js Blog",
  },
  {
    url: "https://www.mongodb.com/blog/rss",
    source: "MongoDB Blog",
  },
  {
    url: "https://vercel.com/blog/rss.xml",
    source: "Vercel Blog",
  },
];

const fetchAllRSSPosts = async () => {
  let allPosts = [];

  for (const feedInfo of feeds) {
    try {
      const feed = await parser.parseURL(feedInfo.url);

      const posts = feed.items.map((item) => ({
        title: item.title,
        description: item.contentSnippet || "",
        url: item.link,
        publishedAt: item.pubDate,
        source: feedInfo.source,
      }));

      allPosts.push(...posts);
    } catch (error) {
      console.log(`Failed: ${feedInfo.source}`);
    }
  }

  return allPosts;
};

module.exports = {
  fetchAllRSSPosts,
};