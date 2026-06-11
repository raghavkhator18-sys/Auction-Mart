const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pendingUsers = require("../services/otpStore");
const pendingResets = require("../services/resetStore");
const { generateOTP } = require("../services/otpServices");

const JWT_SECRET = process.env.JWT_SECRET || "auctionmart_secret_key";

const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    db.get("SELECT email FROM users WHERE email = ?", [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        pendingUsers[email] = {
            name,
            email,
            password: hashedPassword,
            otp,
            expiresAt
        };

        console.log(`\n====================================`);
        console.log(`NEW USER REGISTRATION`);
        console.log(`====================================`);
        console.log(`Name  : ${name}`);
        console.log(`Email : ${email}`);
        console.log(`OTP   : ${otp}`);
        console.log(`====================================\n`);

        res.status(200).json({
            message: "OTP generated successfully"
        });
    });
};

const verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    const user = pendingUsers[email];

    if (!user) {
        return res.status(404).json({
            message: "User not found or OTP expired."
        });
    }

    if (Date.now() > user.expiresAt) {
        delete pendingUsers[email];
        return res.status(400).json({ message: "OTP has expired." });
    }

    if (user.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP."
        });
    }

    db.run(
        `INSERT INTO users (name, email, password, is_verified)
         VALUES (?, ?, ?, ?)`,
        [user.name, user.email, user.password, 1],
        function (err) {
            if (err) {
                return res.status(400).json({
                    error: err.message
                });
            }

            delete pendingUsers[email];

            res.status(201).json({
                message: "Account verified successfully",
                userId: this.lastID
            });
        }
    );
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password."
                });
            }

            if (user.is_verified !== 1) {
                return res.status(401).json({
                    success: false,
                    message: "Please verify your OTP first."
                });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    name: user.name,
                    email: user.email
                }
            });
        }
    );
};

// ============================================================
// FORGOT PASSWORD / RESET PASSKEY FLOW
// ============================================================

// Step 1: User submits their registered email to receive a reset OTP
const forgotPassword = (req, res) => {
    const { email } = req.body;

    // Check if email exists in the users table
    db.get("SELECT email FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({
                message: "No account found with this email address."
            });
        }

        // Generate a 4-digit OTP using the existing service
        const otp = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store the reset session separately from signup sessions
        pendingResets[email] = {
            otp,
            expiresAt,
            verified: false
        };

        // Display OTP in backend terminal (dev mode — no email sending)
        console.log(`\n====================================`);
        console.log(`PASSWORD RESET REQUEST`);
        console.log(`====================================`);
        console.log(`Email : ${email}`);
        console.log(`OTP   : ${otp}`);
        console.log(`====================================\n`);

        res.status(200).json({
            message: "OTP sent successfully. Check your terminal."
        });
    });
};

// Step 2: User submits the OTP they received
const verifyResetOTP = (req, res) => {
    const { email, otp } = req.body;

    const resetSession = pendingResets[email];

    // Check if a reset session exists for this email
    if (!resetSession) {
        return res.status(404).json({
            message: "No reset request found for this email. Please try again."
        });
    }

    // Check if the OTP has expired
    if (Date.now() > resetSession.expiresAt) {
        delete pendingResets[email];
        return res.status(400).json({
            message: "OTP has expired. Please request a new one."
        });
    }

    // Check if the OTP matches
    if (resetSession.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP. Please try again."
        });
    }

    // Mark the session as verified so the reset-password endpoint allows the update
    pendingResets[email].verified = true;

    res.status(200).json({
        message: "OTP verified successfully. You can now set a new password."
    });
};

// Step 3: User submits their new password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const resetSession = pendingResets[email];

    // Ensure the reset session exists and was verified via OTP
    if (!resetSession || !resetSession.verified) {
        return res.status(403).json({
            message: "Unauthorized. Please verify your OTP first."
        });
    }

    try {
        // Hash the new password using bcrypt (same as signup)
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the SQLite database
        db.run(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Clean up the reset session
                delete pendingResets[email];

                console.log(`\n====================================`);
                console.log(`PASSKEY RESET SUCCESSFUL`);
                console.log(`====================================`);
                console.log(`Email : ${email}`);
                console.log(`====================================\n`);

                res.status(200).json({
                    message: "Password has been reset successfully. You can now login with your new password."
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};