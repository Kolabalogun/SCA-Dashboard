require("dotenv").config();
const express = require("express");
const transporter = require("./config/smtp");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Allowed CORS Origin
const allowedOrigins = [
  "http://localhost:5173",
  "https://scadashboard.netlify.app",
  "http://127.0.0.1:5173",
];

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/send-email", async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || emails.length === 0 || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject,
        text: message,
      });
      console.log(`Email sent to ${email} successfully`);
    }
    res
      .status(200)
      .json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send emails",
      stack: error.stack,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
