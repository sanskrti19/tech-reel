const router = require("express").Router();

const { getPosts } = require("../controllers/postController");
const { syncContent } = require("../services/contentSync");

router.get("/", getPosts);

router.get("/sync", async (req, res) => {
  try {
    const count = await syncContent();

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;