const { text } = require("express");
const nodeMailer = require("nodemailer");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000)

const sendOtp = async (email, otp) => {
    const Transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.OTP_EMAIL_USER,
            pass: process.env.OTP_EMAIL_PASS
        },
    });

    const mailOption = {
        from: process.env.OTP_EMAIL_USER,
        to: email,
        subject: "Verify your account by otp",
        text: `Your otp is ${otp} and it will expire in 5 min`,
        html: `<p>Your otp is <strong>${otp}</strong> and it will expire in 5 minutes.</p>`,
        attachments: [],
        headers: {
            "X-Priority": "1",
            "X-Mailer": "Nodemailer"
        }
    }

    await Transporter.sendMail(mailOption);
}

module.exports = {
    sendOtp, generateOtp
}