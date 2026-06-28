const router = require("express").Router();

const auth = require("../middleware/auth");
const {  getPosts,  incrementViews, searchPosts, createPost, updatePost, deletePost} = require("../controllers/postController");
const { syncContent } = require("../services/contentSync");
router.get("/search", searchPosts);

router.get("/", getPosts);
router.post("/:id/view", incrementViews);
router.post("/create", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
 
router.get("/:id/view", (req, res) => {
  res.json({
    routeWorks: true,
    id: req.params.id
  });
});

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