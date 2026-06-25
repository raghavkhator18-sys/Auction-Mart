// ============================================================
// db.js
// PostgreSQL database connection using Supabase.
// Replaces the previous SQLite implementation.
//
// Exports a `pool` (pg Pool) and a Supabase client for Storage.
// Also exports helper wrappers (query, getOne, run) for
// drop-in replacement of the old sqlite3 callback interface.
// ============================================================

const { Pool } = require("pg");
const { createClient } = require("@supabase/supabase-js");
const dns = require("dns");

// Force Node.js to try IPv6 addresses first.
// Supabase direct DB hosts only resolve to IPv6 (AAAA records).
dns.setDefaultResultOrder("verbatim");

// ------------------------------------------------------------
// PostgreSQL Pool — connects to Supabase PostgreSQL
// ------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on("connect", () => {
    console.log("Connected to Supabase PostgreSQL");
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});

// ------------------------------------------------------------
// Supabase Client — used for Storage (image uploads)
// ------------------------------------------------------------
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ------------------------------------------------------------
// Helper: query(text, params)
// Runs a SQL query and returns an array of rows.
// Replaces the old `db.all(sql, params, callback)` pattern.
// ------------------------------------------------------------
async function query(text, params = []) {
    const result = await pool.query(text, params);
    return result.rows;
}

// ------------------------------------------------------------
// Helper: getOne(text, params)
// Runs a SQL query and returns the first row or null.
// Replaces the old `db.get(sql, params, callback)` pattern.
// ------------------------------------------------------------
async function getOne(text, params = []) {
    const result = await pool.query(text, params);
    return result.rows[0] || null;
}

// ------------------------------------------------------------
// Helper: run(text, params)
// Runs a SQL query (INSERT/UPDATE/DELETE) and returns
// { rowCount, rows } for inspecting affected rows and
// RETURNING data.
// Replaces the old `db.run(sql, params, callback)` pattern.
// ------------------------------------------------------------
async function run(text, params = []) {
    const result = await pool.query(text, params);
    return { rowCount: result.rowCount, rows: result.rows };
}

// ------------------------------------------------------------
// Initialize tables if they do not exist
// (mirrors the old SQLite CREATE TABLE IF NOT EXISTS calls)
// ------------------------------------------------------------
async function initTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS auction_lots (
                id SERIAL PRIMARY KEY,
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bids (
                id SERIAL PRIMARY KEY,
                auction_id TEXT NOT NULL,
                user_email TEXT NOT NULL,
                user_name TEXT,
                bid_amount REAL NOT NULL,
                max_bid REAL,
                bid_status TEXT DEFAULT 'winning',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                username TEXT,
                email TEXT,
                category TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS watchlists (
                id SERIAL PRIMARY KEY,
                user_email TEXT NOT NULL,
                auction_id TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_email, auction_id)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_email TEXT NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("PostgreSQL tables verified / created successfully.");
    } catch (err) {
        console.error("Error creating tables:", err.message);
    }
}

// Run table initialization on import
initTables();

module.exports = {
    pool,
    supabase,
    query,
    getOne,
    run
};
