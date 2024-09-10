const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Should be 'mail.shayofunmicareagency.net'
  port: 465, // Should be 465
  secure: true, // Should be true
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

module.exports = transporter;
