/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  setCredentials,
  setIsAuthenticated,
} from "../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { auth, db } from "@/config/firebase";

interface AuthContextProps {
  profile: any;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function AuthProvider({ children }: { children: any }) {
  // Set up local state using hooks
  const [profile, setProfile] = useState<any>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "staffs", user.uid);

        const unsubscribeSnapshot = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();

            const { createdAt, updatedAt, ...restUserData } = userData;

            setProfile(restUserData);
            dispatch(setCredentials(restUserData));
            dispatch(setIsAuthenticated(true));
          } else {
            dispatch(setIsAuthenticated(false));
          }
        });

        // Cleanup the snapshot listener on component unmount or when user signs out
        return () => unsubscribeSnapshot();
      } else {
        // User is signed out
        // dispatch(setCredentials(null));
        dispatch(setIsAuthenticated(false));
      }
    });

    // Cleanup the auth state change listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
