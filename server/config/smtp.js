const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., EMAIL.yourdomain.com
  port: process.env.EMAIL_PORT, // e.g., 587 or 465
  secure: process.env.EMAIL_SECURE === "true", // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER, // Your EMAIL username
    pass: process.env.EMAIL_PASS, // Your EMAIL password
  },
});

module.exports = transporter;
