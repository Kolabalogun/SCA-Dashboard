import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

// Helper function to fetch doc from Firestore
export const fetchFirestoreData = async (
  collectionName: string,
  docId: string
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
