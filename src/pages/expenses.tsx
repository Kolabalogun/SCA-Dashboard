/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpensesIcon } from "@/assets/images";
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
import { Calender } from "@/assets/icons";

const Expenses = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { adminData } = useAppContext();
  const [expensesData, setExpensesData] = useState<any>([]);
  const { user } = useSelector((state: any) => state.auth);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [lastDoc, setLastDoc] = useState<any>(null);

  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [monthlyExpensesTotal, setMonthlyExpensesTotal] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const fetchLimit = 20;

  // Fetch expenses and paginate using "Load More"
  const fetchExpenses = async (loadMore: boolean = false) => {
    const expensesRef = collection(db, "expenses");
    setLoading(true);

    try {
      let q = query(
        expensesRef,
        orderBy("createdAt", "desc"),
        limit(fetchLimit)
      );

      // Start after the last document if loading more expenses
      if (loadMore && lastDoc) {
        q = query(
          expensesRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(fetchLimit)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedexpenses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Save the last document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);

      // Set expenses
      setExpensesData(
        loadMore ? [...expensesData, ...fetchedexpenses] : fetchedexpenses
      );
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showToast(toast, "SCA", "error", "An error occurred fetching expenses");
      setExpensesData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses admitted in the current month and sum amounts
  async function fetchMonthlyexpenses() {
    const expensesRef = collection(db, "expenses");
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const q = query(expensesRef, where("createdAt", ">=", startOfMonth));

    try {
      const querySnapshot = await getDocs(q);

      // Sum all the expenses amounts
      const totalAmount = querySnapshot.docs.reduce(
        (sum, doc) => sum + (parseInt(doc.data().amount) || 0),
        0
      );

      setMonthlyExpensesTotal(totalAmount);
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
      showToast(
        toast,
        "SCA",
        "error",
        "An error occurred fetching monthly expenses"
      );
      setMonthlyExpensesTotal(0);
    }
  }

  // Search expenses by date range, patient, amount or type
  async function searchExpenses() {
    if (!searchTerm.trim() && !startDate && !endDate) {
      fetchExpenses();
      return;
    }

    setSearchLoading(true);

    const expensesRef = collection(db, "expenses");

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
        expensesRef,
        where("type", ">=", searchTerm.trim()),
        where("type", "<=", searchTerm.trim() + "\uf8ff")
      );

      const patientQuery = query(
        expensesRef,
        where("patient", ">=", searchTerm.trim()),
        where("patient", "<=", searchTerm.trim() + "\uf8ff")
      );

      const amountQuery = query(
        expensesRef,
        where("amount", ">=", parseInt(searchTerm.trim())),
        where("amount", "<=", parseInt(searchTerm.trim()) + "\uf8ff")
      );

      const [typeSnapshot, patientSnapshot, amountSnapshot] = await Promise.all(
        [getDocs(typeQuery), getDocs(patientQuery), getDocs(amountQuery)]
      );

      // Combine results from type and patient queries
      const searchedExpense = [
        ...typeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...patientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...amountSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];

      // Create query based on search term or date range
      const q = query(expensesRef, ...queries);

      const querySnapshot = await getDocs(q);
      const searchedExpenses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpensesData(searchTerm.trim() ? searchedExpense : searchedExpenses);
    } catch (error) {
      console.error("Error searching expenses:", error);
      setExpensesData([]);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses();
    fetchMonthlyexpenses();
  }, []);

  return (
    <div className=" flex flex-col space-y-14">
      <section className="w-full flex justify-between items-center  ">
        <div className="space-y-4">
          <h1 className="header">Expenses</h1>
          <p className="text-dark-700">All Expenses Records</p>
        </div>

        <div className="">
          <Button
            onClick={() => navigate("/dashboard/add-expense")}
            className="bg-red-800 text-white"
          >
            Add Expense
          </Button>
        </div>
      </section>
      {AccessRole.Admin === user?.accessRole && (
        <section className="admin-stat">
          <StatCard
            type="pending"
            count={`₦${adminData?.totalExpenses?.toLocaleString() || 0}`}
            label="Total Expenditure"
            icon={ExpensesIcon}
          />

          <StatCard
            type="pending"
            count={`₦${monthlyExpensesTotal || 0}`}
            label="Expenditure For this month"
            icon={Calender}
          />
        </section>
      )}

      {/* Search Input with Date Pickers */}
      <div className="mb-2 flex flex-col xl:flex-row gap-4 z-50 xl:items-center">
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
            onClick={searchExpenses}
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
              fetchExpenses();
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
          data={expensesData || []}
          loadMore={() => fetchExpenses(true)}
          lastDoc={lastDoc}
        />
      )}
    </div>
  );
};

export default Expenses;
