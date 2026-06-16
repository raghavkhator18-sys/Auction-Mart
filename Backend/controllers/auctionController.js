// ============================================================
// auctionController.js
// Handles all auction lot business logic:
//   - createAuctionLot    → POST /auction/create
//   - getAllAuctions       → GET  /auction/all
//   - getAuctionById      → GET  /auction/:id
//   - getUserListings     → GET  /auction/user/:email
//   - deleteAuction       → DELETE /auction/:id
// ============================================================

const { auctionsDb: db } = require("../db");
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
// HELPER: Generate a unique Lot Number
// ============================================================
function generateLotNumber(category) {
    let prefix = "AM";
    if (category.toLowerCase().includes("watch")) prefix = "WA";
    else if (category.toLowerCase().includes("tech") || category.toLowerCase().includes("electronic")) prefix = "TECH";
    else if (category.toLowerCase().includes("auto")) prefix = "AUTO";
    else if (category.toLowerCase().includes("collectible") || category.toLowerCase().includes("art")) prefix = "COL";
    
    // Generate 6-digit random number to ensure high uniqueness
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNum}`;
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
        seller_email,
        seller_name,
        duration,
        status
    } = req.body;

    // --------------------------------------------------------
    // Step 2: Validate required fields
    // --------------------------------------------------------
    if (!title || !category || !starting_price || !seller_email) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => fs.unlink(file.path, () => {}));
        }
        return res.status(400).json({
            message: "title, category, starting_price, and seller_email are required."
        });
    }

    const image_path = req.files && req.files.length > 0
        ? req.files.map(file => `/uploads/${file.filename}`).join(',')
        : null;

    const lot_number = generateLotNumber(category);

    const sql = `
        INSERT INTO auction_lots
            (lot_number, title, category, starting_price, sku_reference, condition_status, description, image_path, seller_email, seller_name, duration, status)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        lot_number,
        title,
        category,
        parseFloat(starting_price),
        sku_reference   || null,
        condition_status|| null,
        description     || null,
        image_path,
        seller_email,
        seller_name     || null,
        parseInt(duration) || 604800,
        status          || 'active'
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
        SELECT * FROM auction_lots
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
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
        // Step 2: Delete the image files from the uploads folder
        //         Only attempt if an image_path was stored
        // --------------------------------------------------------
        if (row.image_path) {
            const paths = row.image_path.split(',');
            paths.forEach((imgPath) => {
                const imageFilePath = getImageFilePath(imgPath.trim());
                fs.unlink(imageFilePath, (fileErr) => {
                    if (fileErr && fileErr.code !== "ENOENT") {
                        console.warn(`Warning: Could not delete image file: ${imageFilePath}`);
                    }
                });
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
