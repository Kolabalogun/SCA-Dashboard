/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useSelector } from "react-redux";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/common/StatCard";
import { ExpensesIcon, PatientsIcon, Revenue, Staff } from "@/assets/images";

const Dashboard = () => {
  const { user } = useSelector((state: any) => state.auth);

  const { adminData } = useAppContext();

  const [patients, setPatients] = useState<any>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  console.log(isLoading);

  async function fetchPatients() {
    const patientsRef = collection(db, "patients");
    setLoading(true);

    try {
      const q = query(patientsRef, orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const patients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className=" flex flex-col space-y-14">
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome {user?.firstName} 👋</h1>
          <p className="text-dark-700">Start the day with managing patients</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={adminData?.totalPatients || 0}
            label="Total Patients"
            icon={PatientsIcon}
          />
          <StatCard
            type="pending"
            count={adminData?.totalRevenue || 0}
            label="Total Revenue"
            icon={Revenue}
          />
          <StatCard
            type="cancelled"
            count={adminData?.totalExpenses || 0}
            label="Total Expenditure"
            icon={ExpensesIcon}
          />
          <StatCard
            type="cancelled"
            count={adminData?.totalStaffs || 0}
            label="Total Staffs"
            icon={Staff}
          />
        </section>

        <DataTable columns={columns} data={patients || []} />
      </main>
    </div>
  );
};

export default Dashboard;
