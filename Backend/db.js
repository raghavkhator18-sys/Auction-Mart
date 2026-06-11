const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/users.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Create users table (existing — do not modify)
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ============================================================
// Create auction_lots table
// This table stores every auction listing created by sellers.
//
// Columns:
//   id               - auto-incrementing primary key
//   title            - product title (required)
//   category         - product category (required)
//   starting_price   - starting bid price as a decimal (required)
//   sku_reference    - optional custom SKU reference code
//   condition_status - product condition (e.g., "New", "Used")
//   description      - long text description of the product
//   image_path       - path to the uploaded image, e.g. /uploads/watch.jpg
//   seller_email     - email of the seller who created the listing
//   created_at       - timestamp of when the listing was created
// ============================================================
db.run(`
    CREATE TABLE IF NOT EXISTS auction_lots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        starting_price REAL NOT NULL,
        sku_reference TEXT,
        condition_status TEXT,
        description TEXT,
        image_path TEXT,
        seller_email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;