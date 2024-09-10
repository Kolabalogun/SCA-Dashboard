require("dotenv").config();
const express = require("express");
const transporter = require("./config/smtp");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://scadashboard.netlify.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  console.log({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
  });

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      text: message,
    });
    console.log("Email sent successfully");
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
      stack: error.stack,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
