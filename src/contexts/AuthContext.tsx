/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
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
        // Query the 'staffs' collection to find a document with the user's email
        const q = query(
          collection(db, "staffs"),
          where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming there's only one document per email
          const docSnap = querySnapshot.docs[0];
          const userData = docSnap.data();

          const { createdAt, updatedAt, birthDate, ...restUserData } = userData;

          setProfile(restUserData);
          dispatch(setCredentials(restUserData));
          dispatch(setIsAuthenticated(true));
        } else {
          dispatch(setIsAuthenticated(false));
        }
      } else {
        // User is signed out
        dispatch(setIsAuthenticated(false));
      }
    });

    // Cleanup the auth listener on component unmount
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
