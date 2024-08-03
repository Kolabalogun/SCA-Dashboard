import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const { FIREBASE_FUNCTION_BASE_API_URL: BASE_URL } = process.env;

const convertDocument = (doc: any) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toDate().toISOString(), // Convert Firestore timestamp to ISO string
  };
};

export const getDocument = async (documentId: string) => {
  try {
    // Create a reference to the document
    const docRef = doc(db, "patients", documentId);

    // Fetch the document
    const docSnap = await getDoc(docRef);

    console.log();

    if (docSnap.exists()) {
      // Convert document data to plain object
      const convertedDoc = convertDocument(docSnap);
      const data = { id: docSnap.id, ...convertedDoc };

      return data;
    } else {
      // Document does not exist
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error; // Re-throw error for further handling if needed
  }
};
