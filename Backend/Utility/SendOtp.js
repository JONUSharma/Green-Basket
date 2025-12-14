const { Resend } = require("resend");

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate 6-digit OTP
 */
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP Email
 * @param {string} email
 * @param {string} otp
 */
const sendOtp = async (email, otp) => {
    try {
        await resend.emails.send({
            from: process.env.OTP_EMAIL_USER || "jonusharma4440@gmail.com",
            to: email,
            subject: "Verify Your Account - OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px;">
                    <h2>Account Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP for account verification is:</p>
                    <h1 style="letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for <strong>15 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br/>
                    <p>Thanks,<br/>Team Support</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Send OTP Error:", error);
        throw new Error("Unable to send OTP email");
    }
};

module.exports = {
    generateOtp,
    sendOtp,
};
