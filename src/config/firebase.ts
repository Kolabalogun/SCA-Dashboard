import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration object with environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize the Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Export instances of authentication, firestore and storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Create a separate app for user creation
export const createAppUserConfig = { ...firebaseConfig };
// export const createApp = initializeApp(createAppUserConfig, "createAppUser");
// export const createAuth = getAuth(createApp);
