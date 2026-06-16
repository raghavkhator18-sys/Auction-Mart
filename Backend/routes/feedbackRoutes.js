const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");
const feedbackMiddleware = require("../middleware/feedbackMiddleware");

// POST /api/feedback - Create feedback (Authenticated or unauthenticated users)
router.post("/", feedbackMiddleware, feedbackController.submitFeedback);

// Admin routes - For now, we secure them with authMiddleware.
// In a full implementation, you would add an admin check middleware here.
router.get("/", authMiddleware, feedbackController.getAllFeedback);
router.get("/:id", authMiddleware, feedbackController.getFeedbackById);
router.patch("/:id/status", authMiddleware, feedbackController.updateFeedbackStatus);

module.exports = router;
