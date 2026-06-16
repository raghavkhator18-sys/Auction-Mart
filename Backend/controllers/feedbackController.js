const feedbackService = require("../services/feedbackService");

// Valid categories
const validCategories = [
    "Feature Request",
    "Bug Report",
    "UI/UX Improvement",
    "Account Issue",
    "Auction Issue",
    "General Feedback"
];

const submitFeedback = async (req, res) => {
    try {
        const { category, subject, message } = req.body;

        // Validation
        if (!category || !validCategories.includes(category)) {
            return res.status(400).json({ success: false, message: "Invalid or missing category" });
        }
        if (!subject || subject.length < 5 || subject.length > 100) {
            return res.status(400).json({ success: false, message: "Subject must be between 5 and 100 characters" });
        }
        if (!message || message.length < 10 || message.length > 2000) {
            return res.status(400).json({ success: false, message: "Message must be between 10 and 2000 characters" });
        }

        // Get user info from token (guaranteed since authMiddleware is applied)
        const user_id = req.user ? req.user.id : null;
        const email = req.user ? req.user.email : null;
        const username = req.user ? req.user.name : null;

        const feedbackData = {
            user_id,
            username,
            email,
            category,
            subject,
            message
        };

        await feedbackService.createFeedback(feedbackData);

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully"
        });

    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await feedbackService.getAllFeedback();
        res.status(200).json({ success: true, feedback });
    } catch (error) {
        console.error("Error getting all feedback:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await feedbackService.getFeedbackById(id);
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        
        res.status(200).json({ success: true, feedback });
    } catch (error) {
        console.error("Error getting feedback by id:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ["pending", "reviewed", "in-progress", "completed"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const result = await feedbackService.updateFeedbackStatus(id, status);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        res.status(200).json({ success: true, message: "Feedback status updated" });
    } catch (error) {
        console.error("Error updating feedback status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus
};
