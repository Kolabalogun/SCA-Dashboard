/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calender } from "@/assets/icons";
import { ExpensesIcon, Revenue as RevenueIcon } from "@/assets/images";
import { StatCard } from "@/components/common/StatCard";
import TableLoader from "@/components/common/TableLoader";
import showToast from "@/components/common/toast";
import { revenueColumns } from "@/components/table/columns";
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
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Revenue = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { user } = useSelector((state: any) => state.auth);
  const [revenueData, setRevenuesData] = useState<any>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { adminData } = useAppContext();

  const [monthlyRevenueTotal, setMonthlyRevenueTotal] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const fetchLimit = 20;

  // Fetch revenue and paginate using "Load More"
  const fetchRevenues = async (loadMore: boolean = false) => {
    const revenueRef = collection(db, "revenue");
    setLoading(true);

    try {
      let q = query(
        revenueRef,
        orderBy("createdAt", "desc"),
        limit(fetchLimit)
      );

      // Start after the last document if loading more revenue
      if (loadMore && lastDoc) {
        q = query(
          revenueRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(fetchLimit)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedrevenue = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Save the last document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Set revenue
      setRevenuesData(
        loadMore ? [...revenueData, ...fetchedrevenue] : fetchedrevenue
      );
    } catch (error) {
      console.error("Error fetching revenue:", error);
      showToast(toast, "SCA", "error", "An error occurred fetching revenues");
      setRevenuesData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch revenue admitted in the current month and sum amounts
  async function fetchMonthlyRevenue() {
    const revenueRef = collection(db, "revenue");
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const q = query(revenueRef, where("createdAt", ">=", startOfMonth));

    try {
      const querySnapshot = await getDocs(q);

      // Sum all the revenue amounts
      const totalAmount = querySnapshot.docs.reduce(
        (sum, doc) => sum + (parseInt(doc.data().amount) || 0),
        0
      );

      setMonthlyRevenueTotal(totalAmount);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      showToast(
        toast,
        "SCA",
        "error",
        "An error occurred fetching monthly revenues"
      );
      setMonthlyRevenueTotal(0);
    }
  }

  // Search revenue by date range, patient, amount or type
  async function searchRevenue() {
    if (!searchTerm.trim() && !startDate && !endDate) {
      fetchRevenues();
      return;
    }

    setSearchLoading(true);

    const revenueRef = collection(db, "revenue");

    try {
      const queries: any[] = [];

      // Date range query
      if (startDate && endDate) {
        queries.push(
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );
      }

      const typeQuery = query(
        revenueRef,
        where("type", ">=", searchTerm.trim().toLowerCase()),
        where("type", "<=", searchTerm.trim().toLowerCase() + "\uf8ff")
      );

      const patientQuery = query(
        revenueRef,
        where("patient", ">=", searchTerm.trim().toLowerCase()),
        where("patient", "<=", searchTerm.trim().toLowerCase() + "\uf8ff")
      );

      const amountQuery = query(
        revenueRef,
        where("amount", ">=", parseInt(searchTerm.trim())),
        where("amount", "<=", parseInt(searchTerm.trim()) + "\uf8ff")
      );

      const [typeSnapshot, patientSnapshot, amountSnapshot] = await Promise.all(
        [getDocs(typeQuery), getDocs(patientQuery), getDocs(amountQuery)]
      );

      // Combine results from type and patient queries
      const searchedRevenues = [
        ...typeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...patientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...amountSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];

      // Create query based on search term or date range
      const q = query(revenueRef, ...queries);

      const querySnapshot = await getDocs(q);
      const searchedRevenue = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRevenuesData(searchTerm.trim() ? searchedRevenues : searchedRevenue);
    } catch (error) {
      console.error("Error searching revenue:", error);
      setRevenuesData([]);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    fetchRevenues();
    fetchMonthlyRevenue();
  }, []);

  return (
    <div className=" flex flex-col space-y-14">
      <section className="w-full flex justify-between items-center  ">
        <div className="space-y-4">
          <h1 className="header">Revenue</h1>
          <p className="text-dark-700">All Revenue Records</p>
        </div>

        <div className="">
          <Button
            onClick={() => navigate("/dashboard/add-revenue")}
            className="bg-green-700 text-white"
          >
            Add Other Income
          </Button>
        </div>
      </section>
      {AccessRole.Admin === user?.accessRole && (
        <section className="w-full   justify-between gap-5 xl:space-y-0 space-y-6   xl:gap-10 xl:grid grid-cols-2">
          <StatCard
            type="pending"
            count={`₦${adminData?.totalRevenue?.toLocaleString() || 0}`}
            label="Total Revenue"
            icon={RevenueIcon}
          />
          <StatCard
            type="appointments"
            count={`₦${
              adminData?.patientAdmissionRevenue?.toLocaleString() || 0
            }`}
            label="Income from Patient Admissions"
            icon={ExpensesIcon}
          />

          <StatCard
            type="cancelled"
            count={`₦${adminData?.otherRevenue?.toLocaleString() || 0}`}
            label="Other Revenue"
            icon={ExpensesIcon}
          />
          <StatCard
            type="appointments"
            count={`₦${monthlyRevenueTotal.toLocaleString() || 0}`} // Use monthly revenue total
            label="Revenue This Month"
            icon={Calender}
          />
        </section>
      )}

      {/* Search Input with Date Pickers */}
      <div className="mb-2 flex xl:flex-row flex-col gap-4 z-50 xl:items-center">
        <input
          type="text"
          placeholder="Search by patient, amount, or type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 px-4  border border-[#363a3d] text-sm flex-1 bg-[#1a1d21] rounded"
        />

        <div className="flex gap-2">
          <ReactDatePicker
            selected={startDate}
            clearButtonTitle="clear"
            clearButtonClassName="text-black"
            onChange={(date) => setStartDate(date)}
            placeholderText="From Date"
            className="py-2 px-4 bg-[#1a1d21] border border-[#363a3d] text-sm rounded"
          />
          <ReactDatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="To Date"
            className="py-2 px-4 bg-[#1a1d21] border border-[#363a3d] text-sm rounded"
          />
        </div>

        <div className="py-3 flex gap-2 items-center">
          <Button
            disabled={isSearchLoading || isLoading}
            className="py-4 bg-[#1d4ed8] ml-2"
            onClick={searchRevenue}
          >
            Search
          </Button>

          <Button
            disabled={isSearchLoading || isLoading}
            className="py-4 text-[#1a1d21] bg-[#c3c2c2] ml-2"
            onClick={() => {
              setSearchTerm("");
              setStartDate(null);
              setEndDate(null);
              fetchRevenues();
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
          columns={revenueColumns}
          data={revenueData || []}
          loadMore={() => fetchRevenues(true)}
          lastDoc={lastDoc}
        />
      )}
    </div>
  );
};

export default Revenue;
