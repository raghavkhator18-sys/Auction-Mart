require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
require("./db");
const cors = require("cors");

const app = express();

// Auction routes
const auctionRoutes = require("./routes/auctionRoutes");

// Bid routes
const bidRoutes = require("./routes/bidRoutes");

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/auction", auctionRoutes);
app.use("/bids", bidRoutes);
app.use("/api/feedback", require("./routes/feedbackRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
