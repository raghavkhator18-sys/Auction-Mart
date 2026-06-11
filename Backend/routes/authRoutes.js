const express = require("express");
const router = express.Router();

const {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} = require("../controllers/authController");

// Existing auth routes
router.post("/signup", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

// Forgot password / reset passkey routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;