/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExpensesIcon,
  PatientsIcon,
  Revenue as RevenueIcon,
} from "@/assets/images";
import { StatCard } from "@/components/common/StatCard";
import TableLoader from "@/components/common/TableLoader";
import showToast from "@/components/common/toast";
import { revenueColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Revenue = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { adminData } = useAppContext();
  const [revenueData, setRevenueData] = useState<any>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  async function fetchRevenueData() {
    const revenueDataRef = collection(db, "revenue");
    setLoading(true);

    try {
      const q = query(revenueDataRef, orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const revenueData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRevenueData(revenueData);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      setRevenueData([]);
      showToast(toast, "SCA", "error", "Error fetching revenue data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchRevenueData();
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
      <section className="admin-stat">
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
          label="Income from Patients Admissions"
          icon={PatientsIcon}
        />

        <StatCard
          type="cancelled"
          count={`₦${adminData?.otherRevenue?.toLocaleString() || 0}`}
          label="Other Revenue"
          icon={ExpensesIcon}
        />
      </section>

      {isLoading ? (
        <TableLoader />
      ) : (
        <DataTable columns={revenueColumns} data={revenueData || []} />
      )}
    </div>
  );
};

export default Revenue;
