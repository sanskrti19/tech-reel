// controllers/aiController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Post = require("../models/Post");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

exports.summarizePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Return cached summary

    if (post.aiSummary) {
      return res.json({
        summary: post.aiSummary,
        cached: true
      });
    }

   const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});
    const prompt = `
Summarize this tech article in 3 concise bullet points.
Keep it beginner friendly.

Title:
${post.title}

Content:
${post.description}
`;

    const result = await model.generateContent(prompt);

    const summary =
      result.response.text();

    post.aiSummary = summary;

    await post.save();

    res.json({
      summary,
      cached: false
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to summarize"
    });

  }
};