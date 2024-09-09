/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchFirestoreData } from "@/lib/firebase";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the types for your context state
interface AdminData {
  totalRevenue: number | string | any;
  totalPatients: number | string | any;
  totalStaffs: number | string | any;
  totalExpenses: number | string | any;
  totalVisitors: number;
  patientAdmissionRevenue: number | string | any;
  otherRevenue: number | string | any;
}

interface AppContextProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  adminData: AdminData | null;
  getAdminContent: () => void;
}

// Create the context with an empty default value
export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Admin Data
  const [adminData, setAdminData] = useState<any>(null);

  const getAdminContent = async () => {
    setIsLoading(true);
    const data = await fetchFirestoreData("admin", "adminDoc");

    if (data) {
      setAdminData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAdminContent();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        adminData,
        getAdminContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export default AppContextProvider;
