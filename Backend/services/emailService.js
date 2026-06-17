const nodemailer = require("nodemailer");

// Create a reusable SMTP transporter using Gmail App Password
// Works with Gmail, Outlook, Yahoo — any SMTP-capable provider
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Sends an OTP verification email to the given address.
 * @param {string} toEmail - Recipient email address
 * @param {string} otp     - The 4-digit OTP code
 * @returns {Promise<void>}
 * @throws Will throw if email delivery fails
 */
const sendOTPEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"AuctionMart" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "AuctionMart Verification Code",
        text: [
            "Welcome to AuctionMart.",
            "",
            "Your verification code is:",
            "",
            otp,
            "",
            "This code will expire in 10 minutes.",
            "",
            "Do not share this code with anyone."
        ].join("\n"),
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #111827; margin: 0 0 8px 0; font-size: 22px;">Welcome to AuctionMart</h2>
                <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 15px;">Your verification code is:</p>
                <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111827;">${otp}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">This code will expire in 10 minutes.</p>
                <p style="color: #9ca3af; font-size: 13px; margin: 0;">Do not share this code with anyone.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] OTP email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error(`[EmailService] Failed to send OTP email to ${toEmail}:`, error.message);
        throw new Error("Failed to send verification email. Please try again.");
    }
};

module.exports = { sendOTPEmail };
