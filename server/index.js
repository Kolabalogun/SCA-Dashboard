const express = require("express");
const transporter = require("../config/smtp");

const cors = require("cors");
require("dotenv").config();

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

  try {
    // let transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: parseInt(process.env.EMAIL_PORT, 10),
    //   secure: process.env.EMAIL_SECURE === "true",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // let mailOptions = {
    //   from: process.env.FROM_EMAIL,
    //   to: email,
    //   subject: subject,
    //   text: message,
    // };

    // await transporter.sendMail(mailOptions);

    await transporter.sendMail({
      from: process.env.FROM_EMAIL, // Sender's email address
      to: email, // Recipient's email address
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
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
