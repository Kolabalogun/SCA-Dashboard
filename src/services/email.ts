/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/emailService.js
import axios from "axios";

// Create a function to send an email
export const sendEmail = async (emailData: any) => {
  try {
    const response = await axios.post(
      "https://scaemailserver.vercel.app/send-email",
      emailData
    );
    return response.data.message;
  } catch (error: any) {
    console.error(
      "Error sending email:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
