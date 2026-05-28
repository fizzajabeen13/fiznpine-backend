const express = require("express");
const router = express.Router();

const {
    chatController,
    titleController
} = require("../controllers/chatController");

// =============================
// CHAT ROUTE (MAIN AI)
// =============================
router.post("/", chatController);

// =============================
// TITLE ROUTE
// =============================
router.post("/title", titleController);

module.exports = router;