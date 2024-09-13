/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload the file to Firebase Storage
export const uploadFileToStorage = async (
  path: string,
  file: any,
  name: string
): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `${path}/${name}/${file.name}`);

  // Upload the file to Firebase Storage
  await uploadBytes(storageRef, file);

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Helper function to fetch doc from Firestore
export const fetchFirestoreData = async <T>(
  collectionName: string,
  docId: string | undefined
): Promise<T | null> => {
  if (docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);
      return snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as T)
        : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return null;
};
