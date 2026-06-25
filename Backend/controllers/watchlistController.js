const { query, run } = require("../db");

// GET /watchlist/:email
const getWatchlist = async (req, res) => {
    const { email } = req.params;
    try {
        const rows = await query(
            `SELECT auction_id FROM watchlists WHERE user_email = $1`,
            [email]
        );
        res.status(200).json(rows.map(row => row.auction_id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /watchlist
const addToWatchlist = async (req, res) => {
    const { user_email, auction_id } = req.body;
    if (!user_email || !auction_id) {
        return res.status(400).json({ message: "user_email and auction_id required" });
    }
    try {
        await run(
            `INSERT INTO watchlists (user_email, auction_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [user_email, auction_id]
        );
        res.status(201).json({ message: "Added to watchlist" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /watchlist/:email/:auctionId
const removeFromWatchlist = async (req, res) => {
    const { email, auctionId } = req.params;
    try {
        await run(
            `DELETE FROM watchlists WHERE user_email = $1 AND auction_id = $2`,
            [email, auctionId]
        );
        res.status(200).json({ message: "Removed from watchlist" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist
};
