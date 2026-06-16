const { auctionsDb: db } = require("../db");

// Insert a new feedback entry
const createFeedback = (feedbackData) => {
    return new Promise((resolve, reject) => {
        const { user_id, username, email, category, subject, message } = feedbackData;
        const query = `
            INSERT INTO feedback (user_id, username, email, category, subject, message)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [user_id, username, email, category, subject, message], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID, ...feedbackData, status: 'pending' });
        });
    });
};

// Retrieve all feedback (Admin)
const getAllFeedback = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM feedback ORDER BY created_at DESC`, [], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// Retrieve a specific feedback by ID (Admin)
const getFeedbackById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM feedback WHERE id = ?`, [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

// Update feedback status (Admin)
const updateFeedbackStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE feedback SET status = ? WHERE id = ?`, [status, id], function (err) {
            if (err) {
                return reject(err);
            }
            // this.changes holds the number of affected rows
            resolve({ id, status, changes: this.changes });
        });
    });
};

module.exports = {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus,
};
