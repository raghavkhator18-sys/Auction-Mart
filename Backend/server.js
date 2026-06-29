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

// Watchlist and Notification routes
const watchlistRoutes = require("./routes/watchlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use(cors());
app.use(express.json());

// Removed /uploads route as we use Supabase storage exclusively

// Mount routes
app.use("/auction", auctionRoutes);
app.use("/bids", bidRoutes);
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/watchlist", watchlistRoutes);
app.use("/notification", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
