require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
require("./db");
const cors = require("cors");

const app = express();

// ─── Existing Auth Routes (do not modify) ─────────────────────
const authRoutes = require("./routes/authRoutes");

// ─── New Auction Routes ────────────────────────────────────────
const auctionRoutes = require("./routes/auctionRoutes");

// ─── Bid Routes ────────────────────────────────────────────────
const bidRoutes = require("./routes/bidRoutes");

app.use(cors());
app.use(express.json());

// ─── Serve uploaded images as static files ─────────────────────
// Any request to /uploads/filename.jpg will serve the file
// directly from the "uploads" folder on disk.
// Example: http://localhost:5000/uploads/1718392039-watch.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Mount Routes ──────────────────────────────────────────────
app.use("/auth", authRoutes);       // existing authentication routes
app.use("/auction", auctionRoutes); // auction listing routes
app.use("/bids", bidRoutes);        // bid routes
app.use("/api/feedback", require("./routes/feedbackRoutes")); // feedback routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});