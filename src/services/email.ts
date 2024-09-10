/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const sendEmail = async (emailData: any) => {
  try {
    const response = await axios.post(
      "https://scaemailserver.vercel.app/send-email",
      {
        emails: emailData.emails,
        subject: emailData.subject,
        message: emailData.message,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
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
