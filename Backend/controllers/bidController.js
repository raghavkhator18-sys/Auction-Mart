// ============================================================
// bidController.js
// Handles bid-related business logic:
//   - placeBid      → POST /bids/place
//   - getUserBids   → GET  /bids/user/:email
// ============================================================

const { auctionsDb: db } = require("../db");

// ============================================================
// POST /bids/place
// Places a bid on any auction (demo or user-created)
// ============================================================
const placeBid = (req, res) => {
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

    const processBid = () => {
        // First, update any previous bids by this user on this auction to 'outbid'
        db.run(
            `UPDATE bids SET bid_status = 'outbid' WHERE auction_id = ? AND user_email = ?`,
            [auction_id, user_email],
            (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ error: updateErr.message });
                }

                // Insert the new bid
                const sql = `
                    INSERT INTO bids (auction_id, user_email, user_name, bid_amount, max_bid, bid_status)
                    VALUES (?, ?, ?, ?, ?, 'winning')
                `;

                const values = [
                    auction_id,
                    user_email,
                    user_name || null,
                    parseFloat(bid_amount),
                    max_bid ? parseFloat(max_bid) : null
                ];

                db.run(sql, values, function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.status(201).json({
                        message: "Bid placed successfully",
                        bidId: this.lastID,
                        auction_id,
                        bid_amount: parseFloat(bid_amount),
                        bid_status: 'winning'
                    });
                });
            }
        );
    };

    if (numericAuctionId) {
        db.get(`SELECT seller_email FROM auction_lots WHERE id = ?`, [numericAuctionId], (err, lot) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (lot && lot.seller_email === user_email) {
                return res.status(403).json({ message: "Sellers cannot bid on their own items." });
            }
            processBid();
        });
    } else {
        processBid();
    }
};

// ============================================================
// GET /bids/user/:email
// Returns all bids placed by a specific user (latest per auction)
// ============================================================
const getUserBids = (req, res) => {
    const { email } = req.params;

    // Get the latest bid per auction for this user
    const sql = `
        SELECT b.*
        FROM bids b
        INNER JOIN (
            SELECT auction_id, MAX(id) as max_id
            FROM bids
            WHERE user_email = ?
            GROUP BY auction_id
        ) latest ON b.id = latest.max_id
        ORDER BY b.created_at DESC
    `;

    db.all(sql, [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// ============================================================
// GET /bids/auction/:auction_id
// Returns all bids placed on a specific auction
// ============================================================
const getAuctionBids = (req, res) => {
    const { auction_id } = req.params;

    const sql = `
        SELECT *
        FROM bids
        WHERE auction_id = ?
        ORDER BY created_at DESC
    `;

    db.all(sql, [auction_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

module.exports = {
    placeBid,
    getUserBids,
    getAuctionBids
};
