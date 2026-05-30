const express = require("express");
const router = express.Router();
const recommendController = require("../controllers/recommendController");

// POST /recommend
// Public endpoint — chatbot team calls this directly
router.post("/", recommendController.recommend);

module.exports = router;
