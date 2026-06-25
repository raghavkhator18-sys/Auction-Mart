// ============================================================
// auctionController.js
// Handles all auction lot business logic:
//   - createAuctionLot    → POST /auction/create
//   - getAllAuctions       → GET  /auction/all
//   - getAuctionById      → GET  /auction/:id
//   - getUserListings     → GET  /auction/user/:email
//   - deleteAuction       → DELETE /auction/:id
//
// Uses Supabase PostgreSQL for data and Supabase Storage
// for product images.
// ============================================================

const { query, getOne, run, supabase } = require("../db");
const fs = require("fs");
const path = require("path");

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
// HELPER: Upload files to Supabase Storage
// Returns an array of public URLs
// ============================================================
async function uploadToSupabaseStorage(files) {
    const urls = [];
    for (const file of files) {
        const fileBuffer = file.buffer;
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
        const storagePath = `products/${Date.now()}-${baseName}${ext}`;

        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(storagePath, fileBuffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            console.error("Supabase Storage upload error:", error.message);
            continue;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(storagePath);

        urls.push(urlData.publicUrl);
    }
    return urls;
}

// ============================================================
// HELPER: Delete a file from Supabase Storage by its public URL
// ============================================================
async function deleteFromSupabaseStorage(publicUrl) {
    try {
        // Extract the storage path from the public URL
        // URL format: https://<project>.supabase.co/storage/v1/object/public/product-images/<path>
        const bucketPrefix = "/storage/v1/object/public/product-images/";
        const idx = publicUrl.indexOf(bucketPrefix);
        if (idx === -1) return; // Not a Supabase Storage URL — skip (e.g. legacy local path)

        const storagePath = decodeURIComponent(publicUrl.substring(idx + bucketPrefix.length));
        const { error } = await supabase.storage
            .from("product-images")
            .remove([storagePath]);

        if (error) {
            console.warn("Warning: Could not delete image from storage:", error.message);
        }
    } catch (err) {
        console.warn("Warning: Error deleting image from storage:", err.message);
    }
}

// ============================================================
// API 1: CREATE AUCTION LOT
// POST /auction/create
// Receives multipart/form-data (text fields + image file)
// ============================================================
const createAuctionLot = async (req, res) => {
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
        return res.status(400).json({
            message: "title, category, starting_price, and seller_email are required."
        });
    }

    try {
        // --------------------------------------------------------
        // Step 3: Upload images to Supabase Storage
        // --------------------------------------------------------
        let image_path = null;
        if (req.files && req.files.length > 0) {
            const urls = await uploadToSupabaseStorage(req.files);
            if (urls.length > 0) {
                image_path = urls.join(",");
            }
        }

        const lot_number = generateLotNumber(category);

        // --------------------------------------------------------
        // Step 4: Insert into PostgreSQL
        // --------------------------------------------------------
        const sql = `
            INSERT INTO auction_lots
                (lot_number, title, category, starting_price, sku_reference, condition_status, description, image_path, seller_email, seller_name, duration, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
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

        const result = await run(sql, values);

        res.status(201).json({
            message: "Auction lot created successfully",
            auctionId: result.rows[0].id
        });
    } catch (err) {
        console.error("Error creating auction lot:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// API 2: GET ALL AUCTION LOTS
// GET /auction/all
// Returns active listings in the database (for browsing/home feed)
// ============================================================
const getAllAuctions = async (req, res) => {
    const appliedFilters = { status: "active" };

    try {
        const rows = await query(
            `SELECT * FROM auction_lots WHERE status = $1 ORDER BY created_at DESC`,
            [appliedFilters.status]
        );

        console.info("[auction/all] Public listing query", {
            totalReturned: rows.length,
            currentUserId: req.headers["x-user-id"] || null,
            appliedFilters
        });
        res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// API 3: GET AUCTION BY ID
// GET /auction/:id
// Returns complete details of one auction lot
// ============================================================
const getAuctionById = async (req, res) => {
    const { id } = req.params;

    try {
        const row = await getOne(
            `SELECT * FROM auction_lots WHERE id = $1`,
            [id]
        );

        // If no record found with that id, return 404
        if (!row) {
            return res.status(404).json({
                message: `Auction lot with id ${id} not found.`
            });
        }

        res.status(200).json(row);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// API 4: GET LISTINGS BY SELLER EMAIL
// GET /auction/user/:email
// Returns all listings created by a specific seller
// ============================================================
const getUserListings = async (req, res) => {
    const { email } = req.params;
    const appliedFilters = { seller_email: email };

    try {
        const rows = await query(
            `SELECT * FROM auction_lots WHERE seller_email = $1 ORDER BY created_at DESC`,
            [email]
        );

        console.info("[auction/user] My Listings query", {
            totalReturned: rows.length,
            currentUserId: req.headers["x-user-id"] || null,
            appliedFilters
        });
        res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ============================================================
// API 5: DELETE AUCTION LOT
// DELETE /auction/:id
// Deletes the image from Supabase Storage AND removes the DB record
// ============================================================
const deleteAuction = async (req, res) => {
    const { id } = req.params;

    try {
        // --------------------------------------------------------
        // Step 1: Find the auction lot to get its image_path
        // --------------------------------------------------------
        const row = await getOne(
            `SELECT * FROM auction_lots WHERE id = $1`,
            [id]
        );

        if (!row) {
            return res.status(404).json({
                message: `Auction lot with id ${id} not found.`
            });
        }

        // --------------------------------------------------------
        // Step 2: Delete the image files from Supabase Storage
        // --------------------------------------------------------
        if (row.image_path) {
            const paths = row.image_path.split(",");
            for (const imgPath of paths) {
                await deleteFromSupabaseStorage(imgPath.trim());
            }
        }

        // --------------------------------------------------------
        // Step 3: Delete the record from PostgreSQL
        // --------------------------------------------------------
        await run(`DELETE FROM auction_lots WHERE id = $1`, [id]);

        res.status(200).json({
            message: `Auction lot with id ${id} deleted successfully.`
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Export all controller functions so routes can use them
module.exports = {
    createAuctionLot,
    getAllAuctions,
    getAuctionById,
    getUserListings,
    deleteAuction
};
