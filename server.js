// Import express
const express = require("express");

// Import CORS
const cors = require("cors");

// Import dotenv
require("dotenv").config();

// Create express app
const app = express();

// Import routes
const chatRoutes = require("./routes/chatRoutes");

// =============================
// MIDDLEWARE
// =============================

// Enable CORS
app.use(cors());

// Enable JSON handling
app.use(express.json());

// =============================
// ROUTES
// =============================

app.use("/api/chat", chatRoutes);

// =============================
// TEST ROUTE
// =============================

app.get("/", (req, res) => {
    res.send("FizNPine AI Backend is Running...");
});

// =============================
// LOCAL SERVER
// =============================

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`FizNPine AI Backend running on port ${PORT}`);
    });
}

// =============================
// EXPORT APP FOR VERCEL
// =============================

module.exports = app;
