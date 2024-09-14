/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calender } from "@/assets/icons";
import { Staff } from "@/assets/images";
import { StatCard } from "@/components/common/StatCard";
import TableLoader from "@/components/common/TableLoader";
import showToast from "@/components/common/toast";
import { staffsColumns } from "@/components/table/columns";
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

const Staffs = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const [staffs, setStaffs] = useState<any>([]);
  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { adminData } = useAppContext();
  const [monthlyStaffs, setMonthlyStaffs] = useState<number>(0);

  const fetchLimit = 20;
  const [isLoading, setLoading] = useState<boolean>(false);

  const [lastDoc, setLastDoc] = useState<any>(null);

  async function fetchStaffs(loadMore: boolean = false) {
    const staffsRef = collection(db, "staffs");
    setLoading(true);

    try {
      let q = query(staffsRef, orderBy("createdAt", "desc"), limit(fetchLimit));

      // Start after the last document if loading more Staffs
      if (loadMore && lastDoc) {
        q = query(
          staffsRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(fetchLimit)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedStaffs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Save the last document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Set Staffs
      setStaffs(loadMore ? [...staffs, ...fetchedStaffs] : fetchedStaffs);
    } catch (error) {
      console.error("Error fetching Staffs:", error);
      showToast(toast, "SCA", "error", "An error occurred fetching Staffs");
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch staffs admitted in the current month
  async function fetchMonthlyStaffs() {
    const staffsRef = collection(db, "staffs");
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const q = query(staffsRef, where("createdAt", ">=", startOfMonth));

    try {
      const querySnapshot = await getDocs(q);
      setMonthlyStaffs(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching monthly staffs:", error);
      setMonthlyStaffs(0);
    }
  }

  // Search Staffs by name, email, or ID
  async function searchStaffs() {
    if (!searchTerm.trim()) {
      fetchStaffs();
      return;
    }

    setSearchLoading(true);

    const staffsRef = collection(db, "staffs");

    try {
      // Search by name
      const nameQuery = query(
        staffsRef,
        where("name", ">=", searchTerm.trim()),
        where("name", "<=", searchTerm.trim() + "\uf8ff")
      );

      // Search by email
      const emailQuery = query(
        staffsRef,
        where("email", ">=", searchTerm.trim()),
        where("email", "<=", searchTerm.trim() + "\uf8ff")
      );

      // Get both name and email results in parallel
      const [nameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(emailQuery),
      ]);

      // Combine results from name and email queries
      const searchedStaffs = [
        ...nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...emailSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];

      // Check for exact match on doc.id
      const idMatch = searchedStaffs.find(
        (staff) => staff.id === searchTerm.trim()
      );

      if (!idMatch) {
        // If no match by doc.id in name/email results, search separately for doc.id
        const allDocsSnapshot = await getDocs(staffsRef);
        const idSearchResult = allDocsSnapshot.docs.find(
          (doc) => doc.id === searchTerm.trim()
        );

        if (idSearchResult) {
          searchedStaffs.push({
            id: idSearchResult.id,
            ...idSearchResult.data(),
          });
        }
      }

      // Remove potential duplicates (if any)
      const uniqueStaffs = searchedStaffs.reduce((acc: any, current: any) => {
        if (!acc.find((item: any) => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setStaffs(uniqueStaffs);
    } catch (error) {
      console.error("Error searching staffs:", error);
      setStaffs([]);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    fetchStaffs();
    fetchMonthlyStaffs();
  }, []);

  return (
    <div className=" flex flex-col space-y-9">
      <section className="w-full flex justify-between items-center  ">
        <div className="space-y-4">
          <h1 className="header">Staffs</h1>
          <p className="text-dark-700">All Staffs Records</p>
        </div>

        {(user?.accessRole === AccessRole.Admin ||
          user?.accessRole === AccessRole.Editor) && (
          <div className="">
            <Button
              onClick={() => navigate("/dashboard/register-staff")}
              className="bg-green-700 text-white"
            >
              Add New Staff
            </Button>
          </div>
        )}
      </section>

      {AccessRole.Admin === user?.accessRole && (
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={adminData?.totalStaffs || 0}
            label="Total Staffs"
            icon={Staff}
          />

          <StatCard
            type="appointments"
            count={monthlyStaffs || 0}
            label="Staffs Employed This Month"
            icon={Calender}
          />
        </section>
      )}

      {/* Search Input */}
      <div className="mb-2 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by Name, Email or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 px-4  border border-[#363a3d] text-sm flex-1 bg-[#1a1d21] rounded"
        />
        <div className="py-3 flex gap-2 items-center">
          <Button
            disabled={isSearchLoading || isLoading}
            className="py-4 bg-[#1d4ed8] ml-2"
            onClick={searchStaffs}
          >
            Search
          </Button>

          <Button
            disabled={isSearchLoading || isLoading}
            className="py-4 text-[#1a1d21] bg-[#c3c2c2] ml-2"
            onClick={() => {
              setSearchTerm("");
              fetchStaffs();
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
          columns={staffsColumns}
          data={staffs || []}
          loadMore={() => fetchStaffs(true)}
          lastDoc={lastDoc}
        />
      )}
    </div>
  );
};

export default Staffs;
