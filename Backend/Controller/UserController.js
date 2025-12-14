const User = require("../Model/UserModle");
const bcrypt = require("bcrypt"); // Needed for bcrypt.compare in login (though model handles it)
const jwt = require("jsonwebtoken");
// const crypto = require('crypt0');
const { generateOtp, sendOtp } = require("../Utility/SendOtp");


// --- SIGNUP (Register User and Send Verification Code) ---
const signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, role, phone } = req.body;

        if (!name || !email || !password || !role || !phone || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Please fill all the details." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password and Confirm Password do not match." });
        }

        const otp = generateOtp()
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            const message = existingUser.email === email ? "User with this email already exists" : "User with this phone number already exists";
            return res.status(400).json({ success: false, message: message });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role,
            phone,
            otp,
            otpExpiry
        });

        await sendOtp(email, otp);
        await newUser.save({ validateBeforeSave: false });
        res.status(201).json({
            success: true,
            message: "User created successfully. A verification code has been sent to your email.",
            user: { _id: newUser._id, email: newUser.email, isVerified: newUser.isVerified }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createSendToken = (user, statusCode, req, res) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "90d",
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
    };

    // Remove sensitive data before sending
    user.password = undefined;

    res.status(statusCode).cookie("token", token, cookieOptions).json({
        success: true,
        message: statusCode === 201 ? "User created successfully. Verification code sent." : "User logged in successfully.",
        user, token
    });
};

// --- EMAIL VERIFICATION (User submits the OTP code) ---
const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide email and verification code." });
        }

        // Find the user with the matching hashed code and non-expired time
        const user = await User.findOne({
            email
        });

        if (otp != user.otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: "Verification code is invalid or has expired" });
        }

        // 1. Verify the user and clear the token fields
        user.isVerified = true
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        // 2. Send token/cookie to log the user in immediately after verification
        createSendToken(user, 200, req, res);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// --- LOGIN (User logs in after verification) ---
const login = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body; // loginIdentifier can be email or phone

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide your login detail and password." });
        }

        // Find the user by email or phone, and explicitly select the password hash
        const Finduser = await User.findOne({ $or: [{ email }, { phone }] }).select('+password');

        if (!Finduser) {
            return res.status(401).json({ success: false, message: "Incorrect login detail or password." });
        }

        // Compare the provided password with the stored hash
        const checkPassword = await Finduser.correctPassword(password, Finduser.password);

        if (!checkPassword) {
            return res.status(401).json({ success: false, message: "Incorrect login detail or password." });
        }

        // CRITICAL: Check if user is verified
        if (!Finduser.isVerified) {
            // Optional: Resend verification code if not verified
            return res.status(403).json({ success: false, message: "Account not verified. Please check your email for the verification code or verify your account." });
        }

        // Log the user in
        createSendToken(Finduser, 200, req, res);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// create user who created the account but not verified
const reSignup = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: req.body });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        if (user && !user.isVerified) {
            return res.status(403).json({ success: false, message: "Account not verified. Please check your email for the verification code or verify your account." });
        }
        const otp = generateOtp()
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
        await sendOtp(email, otp)
        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()
        res.status(200).json({ success: true, message: "Verification code sent successfully." });
    } catch (error) {

    }
}
module.exports = {
    signup,
    verifyEmail,
    login,
    reSignup
};