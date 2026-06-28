const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getBookmarks,
  toggleBookmark,
  removeBookmark
} = require("../controllers/bookmarkController");

router.get("/", auth, getBookmarks);
router.post("/:postId", auth, toggleBookmark);
router.delete("/:postId", auth, removeBookmark);

module.exports = router;
