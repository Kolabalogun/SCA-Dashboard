import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration object with environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCPz3mZSa6lmF_ncCuu6Ck8DPp7twMeTaY",
  authDomain: "shayofunmicareagency-928eb.firebaseapp.com",
  projectId: "shayofunmicareagency-928eb",
  storageBucket: "shayofunmicareagency-928eb.appspot.com",
  messagingSenderId: "781408685273",
  appId: "1:781408685273:web:de1b2fef68ad17f41b02c8",
  measurementId: "G-ESCSB8KG5B",
};

// Initialize the Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Export instances of authentication, firestore and storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
