const express = require("express");
const router = express.Router();
const { placeBid, getUserBids, getAuctionBids } = require("../controllers/bidController");

// POST /bids/place — Place a bid on an auction
router.post("/place", placeBid);

// GET /bids/user/:email — Get all bids by a user
router.get("/user/:email", getUserBids);

// GET /bids/auction/:auction_id - Get all bids for an auction
router.get("/auction/:auction_id", getAuctionBids);

module.exports = router;
