const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON data and enable CORS
app.use(express.json());
app.use(cors());

// Create the email route
app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    // Setup transporter with your email service credentials
    let transporter = nodemailer.createTransport({
      //   service: "Gmail", // or any other email service
      host: process.env.EMAIL_HOST, // e.g., EMAIL.yourdomain.com
      port: process.env.EMAIL_PORT, // e.g., 587 or 465
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Define the email options
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
