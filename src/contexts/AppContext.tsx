/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import showToast from "@/components/common/toast";
import { db } from "@/config/firebase";
import { fetchFirestoreData } from "@/lib/firebase";
import { useToast } from "@chakra-ui/react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
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
  professionalCareOfficers: any[];
  adminEmails: string[];
  fetchStaffs: () => void;
}

// Create the context with an empty default value
export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professionalCareOfficers, setStaffs] = useState<any>([]);
  const [adminEmails, setAdmins] = useState<any>([]);
  const toast = useToast();

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
    if (professionalCareOfficers.length > 0) {
      const filteredStaff = professionalCareOfficers.filter(
        (staff: { occupation: string }) => staff.occupation === "Administrator"
      );

      const filteredStaffAdminEmails = filteredStaff.map(
        (staff: { email: string }) => staff.email
      );

      setAdmins(filteredStaffAdminEmails);
    }
  }, [professionalCareOfficers]);

  async function fetchStaffs() {
    const staffsRef = collection(db, "staffs");
    setIsLoading(true);

    try {
      const q = query(
        staffsRef,
        orderBy("createdAt", "desc"),
        where("occupation", "in", [
          "Professional Care Officer",
          "Psychiatric Physician",
          "Administrator",
        ])
      );

      const querySnapshot = await getDocs(q);
      const staffs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffs(staffs);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setStaffs([]);
      showToast(
        toast,
        "Registration",
        "error",
        "Error fetching Primary care professionals"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAdminContent();
    fetchStaffs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        adminData,
        getAdminContent,
        professionalCareOfficers,
        adminEmails,
        fetchStaffs,
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
