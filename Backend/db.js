const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Resolve database directory path using path.join and __dirname
const dbDir = path.join(__dirname, "database");

// Create database folder automatically if it does not exist
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Database folder automatically created at: ${dbDir}`);
} else {
    console.log(`Database folder exists at: ${dbDir}`);
}

const auctionsDbPath = path.join(dbDir, "auctions.db");

// Log resolved database paths on startup
console.log(`Resolved auctions.db absolute path: ${auctionsDbPath}`);

// ------------------------------------------------------------
// Database: Auctions (products, bids, feedback)
// ------------------------------------------------------------
const auctionsDb = new sqlite3.Database(auctionsDbPath, (err) => {
    if (err) console.error("auctions.db error:", err.message);
    else console.log("Connected to SQLite database: auctions.db");
});

auctionsDb.run(`
    CREATE TABLE IF NOT EXISTS auction_lots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lot_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        starting_price REAL NOT NULL,
        sku_reference TEXT,
        condition_status TEXT,
        description TEXT,
        image_path TEXT,
        seller_email TEXT,
        seller_name TEXT,
        duration INTEGER DEFAULT 604800,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

auctionsDb.run(`
    CREATE TABLE IF NOT EXISTS bids (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        auction_id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        user_name TEXT,
        bid_amount REAL NOT NULL,
        max_bid REAL,
        bid_status TEXT DEFAULT 'winning',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

auctionsDb.run(`
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NULL,
        username TEXT,
        email TEXT,
        category TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = {
    auctionsDb
};
