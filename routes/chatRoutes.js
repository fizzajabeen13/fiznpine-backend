// Import express
const express = require("express");

// Create router
const router = express.Router();


// Import controller
const { chatController, titleController } = require("../controllers/chatController");


// =============================
// CHAT ROUTE
// =============================

router.post("/", chatController);
router.post("/title", titleController);


// Export router
module.exports = router;