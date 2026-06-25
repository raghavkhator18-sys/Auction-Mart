const { query, run } = require("../db");

// GET /notification/:email
const getNotifications = async (req, res) => {
    const { email } = req.params;
    try {
        const rows = await query(
            `SELECT * FROM notifications WHERE user_email = $1 ORDER BY created_at DESC`,
            [email]
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /notification
const createNotification = async (req, res) => {
    const { user_email, message } = req.body;
    if (!user_email || !message) {
        return res.status(400).json({ message: "user_email and message required" });
    }
    try {
        const result = await run(
            `INSERT INTO notifications (user_email, message) VALUES ($1, $2) RETURNING *`,
            [user_email, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /notification/:id/read
const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await run(`UPDATE notifications SET is_read = TRUE WHERE id = $1`, [id]);
        res.status(200).json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /notification/:email
const clearNotifications = async (req, res) => {
    const { email } = req.params;
    try {
        await run(`DELETE FROM notifications WHERE user_email = $1`, [email]);
        res.status(200).json({ message: "Notifications cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getNotifications,
    createNotification,
    markAsRead,
    clearNotifications
};
