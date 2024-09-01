import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload the file to Firebase Storage
export const uploadFileToStorage = async (
  file: File,
  name: string
): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(
    storage,
    `identificationDocuments/${name}/${file.name}`
  );

  // Upload the file to Firebase Storage
  await uploadBytes(storageRef, file);

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Helper function to fetch doc from Firestore
export const fetchFirestoreData = async (
  collectionName: string,
  docId: string | undefined
) => {
  {
    if (docId)
      try {
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? snapshot.data() : null;
      } catch (error) {
        console.log(error);
        return null;
      }
  }
};
