/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

export const sendEmail = async (emailData: any) => {
  try {
    const response = await axios.post(
      "https://scaemailserver.vercel.app/send-email",
      emailData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 10000, // Adjust timeout if needed
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
