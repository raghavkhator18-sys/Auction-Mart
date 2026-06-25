// ============================================================
// bidController.js
// Handles bid-related business logic:
//   - placeBid      → POST /bids/place
//   - getUserBids   → GET  /bids/user/:email
//   - getAuctionBids→ GET  /bids/auction/:auction_id
//   - getHighestBids→ GET  /bids/highest
//
// Uses Supabase PostgreSQL via the db helpers.
// ============================================================

const { query, getOne, run } = require("../db");

// ============================================================
// POST /bids/place
// Places a bid on any auction (demo or user-created)
// ============================================================
const placeBid = async (req, res) => {
    const { auction_id, user_email, user_name, bid_amount, max_bid } = req.body;

    if (!auction_id || !user_email || !bid_amount) {
        return res.status(400).json({
            message: "auction_id, user_email, and bid_amount are required."
        });
    }

    let numericAuctionId = null;
    if (typeof auction_id === 'string' && auction_id.startsWith('db-')) {
        numericAuctionId = parseInt(auction_id.replace('db-', ''), 10);
    }

    try {
        // Check if seller is trying to bid on their own item
        if (numericAuctionId) {
            const lot = await getOne(
                `SELECT seller_email FROM auction_lots WHERE id = $1`,
                [numericAuctionId]
            );
            if (lot && lot.seller_email === user_email) {
                return res.status(403).json({ message: "Sellers cannot bid on their own items." });
            }
        }

        // First, update any previous bids by this user on this auction to 'outbid'
        await run(
            `UPDATE bids SET bid_status = 'outbid' WHERE auction_id = $1 AND user_email = $2`,
            [auction_id, user_email]
        );

        // Insert the new bid
        const sql = `
            INSERT INTO bids (auction_id, user_email, user_name, bid_amount, max_bid, bid_status)
            VALUES ($1, $2, $3, $4, $5, 'winning')
            RETURNING id
        `;

        const values = [
            auction_id,
            user_email,
            user_name || null,
            parseFloat(bid_amount),
            max_bid ? parseFloat(max_bid) : null
        ];

        const result = await run(sql, values);

        res.status(201).json({
            message: "Bid placed successfully",
            bidId: result.rows[0].id,
            auction_id,
            bid_amount: parseFloat(bid_amount),
            bid_status: 'winning'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// GET /bids/user/:email
// Returns all bids placed by a specific user (latest per auction)
// ============================================================
const getUserBids = async (req, res) => {
    const { email } = req.params;

    // Get the latest bid per auction for this user
    const sql = `
        SELECT b.*
        FROM bids b
        INNER JOIN (
            SELECT auction_id, MAX(id) as max_id
            FROM bids
            WHERE user_email = $1
            GROUP BY auction_id
        ) latest ON b.id = latest.max_id
        ORDER BY b.created_at DESC
    `;

    try {
        const rows = await query(sql, [email]);
        res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// GET /bids/auction/:auction_id
// Returns all bids placed on a specific auction
// ============================================================
const getAuctionBids = async (req, res) => {
    const { auction_id } = req.params;

    const sql = `
        SELECT *
        FROM bids
        WHERE auction_id = $1
        ORDER BY created_at DESC
    `;

    try {
        const rows = await query(sql, [auction_id]);
        res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// GET /bids/highest
// Returns the highest bid amount, total bid count, and highest
// bidder info for every auction that has received at least one bid.
// ============================================================
const getHighestBids = async (req, res) => {
    const sql = `
        SELECT DISTINCT ON (b.auction_id)
            b.auction_id,
            b.bid_amount   AS highest_bid,
            b.user_email   AS highest_bidder_email,
            b.user_name    AS highest_bidder_name,
            counts.total_bids
        FROM bids b
        INNER JOIN (
            SELECT auction_id, MAX(bid_amount) AS max_amount, COUNT(*) AS total_bids
            FROM bids
            GROUP BY auction_id
        ) counts ON b.auction_id = counts.auction_id AND b.bid_amount = counts.max_amount
        ORDER BY b.auction_id, b.created_at DESC
    `;

    try {
        const rows = await query(sql, []);
        res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    placeBid,
    getUserBids,
    getAuctionBids,
    getHighestBids
};
