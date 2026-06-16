const sqlite3 = require("sqlite3").verbose();

// ------------------------------------------------------------
// Database 1: Users (auth)
// ------------------------------------------------------------
const usersDb = new sqlite3.Database("./database/users.db", (err) => {
    if (err) console.error("users.db error:", err.message);
    else console.log("Connected to SQLite database: users.db");
});

usersDb.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ------------------------------------------------------------
// Database 2: Auctions (products, bids, feedback)
// ------------------------------------------------------------
const auctionsDb = new sqlite3.Database("./database/auctions.db", (err) => {
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
    usersDb,
    auctionsDb
};