// routes/aiRoutes.js

const express = require("express");
const router = express.Router();
const { summarizePost } = require("../controllers/aiController");

router.post("/summarize/:id", summarizePost);

module.exports = router;