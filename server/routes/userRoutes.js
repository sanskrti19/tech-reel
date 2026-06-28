const router = require("express").Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile, getCreator, toggleFollow, getAnalytics } = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);
router.get("/creator/:id", getCreator);
router.post("/creator/:id/follow", auth, toggleFollow);
router.delete("/creator/:id/follow", auth, toggleFollow);
router.get("/analytics", auth, getAnalytics);

module.exports = router;