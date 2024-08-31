import { fetchFirestoreData } from "@/utils/firebase/fetchFirestoreData";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the types for your context state
interface AdminData {
  totalRevenue: number;
  totalPatients: number;
  totalStaffs: number;
  totalExpenses: number;
  totalVisitors: number;
}

interface AppContextProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  adminData: AdminData | null;
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
