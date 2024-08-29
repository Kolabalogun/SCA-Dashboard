import { Timestamp } from "firebase/firestore";

export const formatDateTime = (timestamp: Timestamp): string => {
  // Convert the Firestore Timestamp to a JavaScript Date object
  const parsedDate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  // Format the date as MM/DD/YYYY
  const formattedDate = parsedDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  // Format the time as HH:MM:SS
  const formattedTime = parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${formattedDate}, ${formattedTime}`;
};
