/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpensesIcon } from "@/assets/images";
import { StatCard } from "@/components/common/StatCard";
import TableLoader from "@/components/common/TableLoader";
import showToast from "@/components/common/Toast";
import { revenueColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { adminData } = useAppContext();
  const [expensesData, setExpensesData] = useState<any>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  async function fetchExpensesData() {
    const expensesDataRef = collection(db, "expenses");
    setLoading(true);

    try {
      const q = query(expensesDataRef, orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const expensesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpensesData(expensesData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpensesData([]);
      showToast(toast, "SCA", "error", "Error fetching expenses data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchExpensesData();
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
      <section className="admin-stat">
        <StatCard
          type="pending"
          count={`₦${adminData?.totalExpenses?.toLocaleString() || 0}`}
          label="Total Expenses"
          icon={ExpensesIcon}
        />
      </section>

      {isLoading ? (
        <TableLoader />
      ) : (
        <DataTable columns={revenueColumns} data={expensesData || []} />
      )}
    </div>
  );
};

export default Expenses;
