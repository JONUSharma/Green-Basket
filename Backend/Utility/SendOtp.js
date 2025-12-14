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

    await Transporter.sendMail({
    from: `"Green Basket" <${process.env.OTP_EMAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
}

module.exports = {
    sendOtp, generateOtp
}