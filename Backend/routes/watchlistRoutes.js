const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlistController");

router.get("/:email", watchlistController.getWatchlist);
router.post("/", watchlistController.addToWatchlist);
router.delete("/:email/:auctionId", watchlistController.removeFromWatchlist);

module.exports = router;
