// ============================================================
// feedbackService.js
// Data access layer for feedback.
// Uses Supabase PostgreSQL via the db helpers.
// ============================================================

const { query, getOne, run } = require("../db");

// Insert a new feedback entry
const createFeedback = async (feedbackData) => {
    const { user_id, username, email, category, subject, message } = feedbackData;
    const sql = `
        INSERT INTO feedback (user_id, username, email, category, subject, message)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;
    const result = await run(sql, [user_id, username, email, category, subject, message]);
    return { id: result.rows[0].id, ...feedbackData, status: 'pending' };
};

// Retrieve all feedback (Admin)
const getAllFeedback = async () => {
    return await query(`SELECT * FROM feedback ORDER BY created_at DESC`);
};

// Retrieve a specific feedback by ID (Admin)
const getFeedbackById = async (id) => {
    return await getOne(`SELECT * FROM feedback WHERE id = $1`, [id]);
};

// Update feedback status (Admin)
const updateFeedbackStatus = async (id, status) => {
    const result = await run(
        `UPDATE feedback SET status = $1 WHERE id = $2`,
        [status, id]
    );
    // result.rowCount holds the number of affected rows
    return { id, status, changes: result.rowCount };
};

module.exports = {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus,
};
