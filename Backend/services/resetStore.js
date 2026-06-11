// In-memory store for password reset sessions
// Keeps reset OTP data separate from signup OTP data (pendingUsers)
// Format: { email: { otp, expiresAt, verified } }

const pendingResets = {};

module.exports = pendingResets;
