const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/:email", notificationController.getNotifications);
router.post("/", notificationController.createNotification);
router.put("/:id/read", notificationController.markAsRead);
router.delete("/:email", notificationController.clearNotifications);

module.exports = router;
