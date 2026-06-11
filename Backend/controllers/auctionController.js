// ============================================================
// auctionController.js
// Handles all auction lot business logic:
//   - createAuctionLot    → POST /auction/create
//   - getAllAuctions       → GET  /auction/all
//   - getAuctionById      → GET  /auction/:id
//   - getUserListings     → GET  /auction/user/:email
//   - deleteAuction       → DELETE /auction/:id
// ============================================================

const db = require("../db");
const fs = require("fs");
const path = require("path");

// ============================================================
// HELPER: Build the full path to an uploaded image file.
//         image_path in DB is stored as "/uploads/filename.jpg"
//         We strip the leading "/" and join with project root.
// ============================================================
function getImageFilePath(imagePath) {
    // Remove the leading "/" to get a relative path like "uploads/filename.jpg"
    const relativePath = imagePath.replace(/^\//, "");
    // Build an absolute path from the Backend folder
    return path.join(__dirname, "..", relativePath);
}

// ============================================================
// API 1: CREATE AUCTION LOT
// POST /auction/create
// Receives multipart/form-data (text fields + image file)
// ============================================================
const createAuctionLot = (req, res) => {
    // --------------------------------------------------------
    // Step 1: Extract text fields from the form
    // --------------------------------------------------------
    const {
        title,
        category,
        starting_price,
        sku_reference,
        condition_status,
        description,
        seller_email
    } = req.body;

    // --------------------------------------------------------
    // Step 2: Validate required fields
    //         title, category, starting_price, and seller_email
    //         are the minimum needed to create a listing.
    // --------------------------------------------------------
    if (!title || !category || !starting_price || !seller_email) {
        // If an image was already uploaded but validation fails,
        // delete the uploaded image to avoid orphan files.
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({
            message: "title, category, starting_price, and seller_email are required."
        });
    }

    // --------------------------------------------------------
    // Step 3: Build the image_path to store in the database.
    //         If no image was uploaded, store null.
    //         We store the URL-accessible path like "/uploads/filename.jpg"
    //         so the frontend can directly use it as an <img src="...">
    // --------------------------------------------------------
    const image_path = req.file
        ? `/uploads/${req.file.filename}`
        : null;

    // --------------------------------------------------------
    // Step 4: Insert the auction lot record into SQLite
    // --------------------------------------------------------
    const sql = `
        INSERT INTO auction_lots
            (title, category, starting_price, sku_reference, condition_status, description, image_path, seller_email)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        category,
        parseFloat(starting_price),   // ensure it's stored as a number
        sku_reference   || null,
        condition_status|| null,
        description     || null,
        image_path,
        seller_email
    ];

    db.run(sql, values, function (err) {
        if (err) {
            // If DB insert fails, delete the uploaded image to keep things clean
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(500).json({ error: err.message });
        }

        // this.lastID gives the auto-generated ID of the new row
        res.status(201).json({
            message: "Auction lot created successfully",
            auctionId: this.lastID
        });
    });
};

// ============================================================
// API 2: GET ALL AUCTION LOTS
// GET /auction/all
// Returns every listing in the database (for browsing/home feed)
// ============================================================
const getAllAuctions = (req, res) => {
    const sql = `
        SELECT
            id,
            title,
            category,
            starting_price,
            sku_reference,
            condition_status,
            image_path,
            seller_email,
            created_at
        FROM auction_lots
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Return the array of auction lots (empty array if none exist)
        res.status(200).json(rows);
    });
};

// ============================================================
// API 3: GET AUCTION BY ID
// GET /auction/:id
// Returns complete details of one auction lot
// ============================================================
const getAuctionById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT * FROM auction_lots WHERE id = ?
    `;

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // If no record found with that id, return 404
        if (!row) {
            return res.status(404).json({
                message: `Auction lot with id ${id} not found.`
            });
        }

        res.status(200).json(row);
    });
};

// ============================================================
// API 4: GET LISTINGS BY SELLER EMAIL
// GET /auction/user/:email
// Returns all listings created by a specific seller
// ============================================================
const getUserListings = (req, res) => {
    const { email } = req.params;

    const sql = `
        SELECT * FROM auction_lots
        WHERE seller_email = ?
        ORDER BY created_at DESC
    `;

    db.all(sql, [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(rows);
    });
};

// ============================================================
// API 5: DELETE AUCTION LOT
// DELETE /auction/:id
// Deletes the image file from disk AND removes the DB record
// ============================================================
const deleteAuction = (req, res) => {
    const { id } = req.params;

    // --------------------------------------------------------
    // Step 1: Find the auction lot to get its image_path
    //         We need this so we can delete the image file too
    // --------------------------------------------------------
    db.get("SELECT * FROM auction_lots WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({
                message: `Auction lot with id ${id} not found.`
            });
        }

        // --------------------------------------------------------
        // Step 2: Delete the image file from the uploads folder
        //         Only attempt if an image_path was stored
        // --------------------------------------------------------
        if (row.image_path) {
            const imageFilePath = getImageFilePath(row.image_path);

            // fs.unlink removes the file — we use a callback but
            // don't block the DB deletion even if file removal fails
            fs.unlink(imageFilePath, (fileErr) => {
                if (fileErr && fileErr.code !== "ENOENT") {
                    // ENOENT means file was already missing — that's okay
                    console.warn(`Warning: Could not delete image file: ${imageFilePath}`);
                }
            });
        }

        // --------------------------------------------------------
        // Step 3: Delete the record from SQLite
        // --------------------------------------------------------
        db.run("DELETE FROM auction_lots WHERE id = ?", [id], function (dbErr) {
            if (dbErr) {
                return res.status(500).json({ error: dbErr.message });
            }

            res.status(200).json({
                message: `Auction lot with id ${id} deleted successfully.`
            });
        });
    });
};

// Export all controller functions so routes can use them
module.exports = {
    createAuctionLot,
    getAllAuctions,
    getAuctionById,
    getUserListings,
    deleteAuction
};
