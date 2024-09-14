/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calender } from "@/assets/icons";
import { PatientsIcon } from "@/assets/images";
import { StatCard } from "@/components/common/StatCard";
import TableLoader from "@/components/common/TableLoader";
import showToast from "@/components/common/toast";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { useAppContext } from "@/contexts/AppContext";
import { AccessRole } from "@/types/types";
import { useToast } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [patients, setPatients] = useState<any>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { adminData } = useAppContext();
  const [monthlyPatients, setMonthlyPatients] = useState<number>(0);

  const fetchLimit = 20;

  // Fetch patients and paginate using "Load More"
  async function fetchPatients(loadMore: boolean = false) {
    const patientsRef = collection(db, "patients");
    setLoading(true);

    try {
      let q = query(
        patientsRef,
        orderBy("createdAt", "desc"),
        limit(fetchLimit)
      );

      // Start after the last document if loading more patients
      if (loadMore && lastDoc) {
        q = query(
          patientsRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(fetchLimit)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedPatients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Save the last document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Set patients
      setPatients(
        loadMore ? [...patients, ...fetchedPatients] : fetchedPatients
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
      showToast(toast, "SCA", "error", "An error occurred fetching patients");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch patients admitted in the current month
  async function fetchMonthlyPatients() {
    const patientsRef = collection(db, "patients");
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const q = query(patientsRef, where("createdAt", ">=", startOfMonth));

    try {
      const querySnapshot = await getDocs(q);
      setMonthlyPatients(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching monthly patients:", error);
      setMonthlyPatients(0);
    }
  }

  // Search patients by name, email,primaryPhysician or ID
  async function searchPatients() {
    if (!searchTerm.trim()) {
      fetchPatients();
      return;
    }

    setSearchLoading(true);

    const patientsRef = collection(db, "patients");

    try {
      // Search by name
      const nameQuery = query(
        patientsRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );

      // Search by email
      const emailQuery = query(
        patientsRef,
        where("email", ">=", searchTerm),
        where("email", "<=", searchTerm + "\uf8ff")
      );

      // Search by primaryPhysician
      const primaryPhysicianQuery = query(
        patientsRef,
        where("primaryPhysician", ">=", searchTerm),
        where("primaryPhysician", "<=", searchTerm + "\uf8ff")
      );

      // Search by patientStatus
      const patientStatusQuery = query(
        patientsRef,
        where("patientStatus", ">=", searchTerm),
        where("patientStatus", "<=", searchTerm + "\uf8ff")
      );

      // Get both name and email results in parallel
      const [
        nameSnapshot,
        emailSnapshot,
        primaryPhysicianSnapshot,
        patientStatusSnapshot,
      ] = await Promise.all([
        getDocs(nameQuery),
        getDocs(emailQuery),
        getDocs(primaryPhysicianQuery),
        getDocs(patientStatusQuery),
      ]);

      // Combine results from name and email queries
      const searchedPatients = [
        ...nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...emailSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...primaryPhysicianSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...patientStatusSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      // Check for exact match on doc.id
      const idMatch = searchedPatients.find(
        (patient) => patient.id === searchTerm
      );

      if (!idMatch) {
        // If no match by doc.id in name/email results, search separately for doc.id
        const allDocsSnapshot = await getDocs(patientsRef);
        const idSearchResult = allDocsSnapshot.docs.find(
          (doc) => doc.id === searchTerm
        );

        if (idSearchResult) {
          searchedPatients.push({
            id: idSearchResult.id,
            ...idSearchResult.data(),
          });
        }
      }

      // Remove potential duplicates (if any)
      const uniquePatients = searchedPatients.reduce(
        (acc: any, current: any) => {
          if (!acc.find((item: any) => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      setPatients(uniquePatients);
    } catch (error) {
      console.error("Error searching patients:", error);
      setPatients([]);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
    fetchMonthlyPatients();
  }, []);

  return (
    <div className="flex flex-col space-y-8">
      <section className="w-full flex justify-between items-center">
        <div className="space-y-4">
          <h1 className="header">Patients</h1>
          <p className="text-dark-700">All Patients Records</p>
        </div>
        {(user?.accessRole === AccessRole.Admin ||
          user?.accessRole === AccessRole.Editor) && (
          <div className="">
            <Button
              onClick={() => navigate("/dashboard/register-patient")}
              className="bg-green-700 text-white"
            >
              Add New Patient
            </Button>
          </div>
        )}
      </section>

      <section className="admin-stat">
        <StatCard
          type="appointments"
          count={adminData?.totalPatients || 0}
          label="Total Patients"
          icon={PatientsIcon}
        />

        <StatCard
          type="appointments"
          count={monthlyPatients || 0}
          label="Patients Admitted This Month"
          icon={Calender}
        />
      </section>

      {/* Search Input */}
      <div className="mb-2 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by Name, Email, Primary Physician or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 px-4  border border-[#363a3d] text-sm flex-1 bg-[#1a1d21] rounded"
        />
        <div className="py-3 flex gap-2 items-center">
          <Button
            disabled={isSearchLoading || isLoading}
            className="py-4 bg-[#1d4ed8] ml-2"
            onClick={searchPatients}
          >
            Search
          </Button>

          <Button
            disabled={isSearchLoading || isLoading}
            className="py-4 text-[#1a1d21] bg-[#c3c2c2] ml-2"
            onClick={() => {
              setSearchTerm("");
              fetchPatients();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {isLoading || isSearchLoading ? (
        <TableLoader />
      ) : (
        <DataTable
          columns={columns}
          data={patients || []}
          loadMore={() => fetchPatients(true)}
          lastDoc={lastDoc}
        />
      )}

      {/* Load More Button */}
      {/* {lastDoc && (
        <Button
          className="mt-4 j  flex self-end bg-blue-700 text-white"
          onClick={() => fetchPatients(true)}
        >
          Load More Patients
        </Button>
      )} */}
    </div>
  );
};

export default Patients;
