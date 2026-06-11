require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
const db = require("./db");
const cors = require("cors");

const app = express();

// ─── Existing Auth Routes (do not modify) ─────────────────────
const authRoutes = require("./routes/authRoutes");

// ─── New Auction Routes ────────────────────────────────────────
const auctionRoutes = require("./routes/auctionRoutes");

app.use(cors());
app.use(express.json());

// ─── Serve uploaded images as static files ─────────────────────
// Any request to /uploads/filename.jpg will serve the file
// directly from the "uploads" folder on disk.
// Example: http://localhost:5000/uploads/1718392039-watch.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Mount Routes ──────────────────────────────────────────────
app.use("/auth", authRoutes);       // existing authentication routes
app.use("/auction", auctionRoutes); // new auction listing routes

app.listen(5000, () => {
    console.log("Server running on port 5000");
});