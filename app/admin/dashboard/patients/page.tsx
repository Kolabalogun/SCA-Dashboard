"use client";
import React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";

const Patients = () => {
  const [patients, setPatients] = useState<any>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  console.log(patients);

  async function fetchPatients() {
    const patientsRef = collection(db, "patients");
    setLoading(true);

    try {
      const q = query(patientsRef, orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const patients = querySnapshot.docs.map((doc) => doc.data());
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
      <section className="w-full space-y-4">
        <h1 className="header">Patients</h1>
        <p className="text-dark-700">All Patients Records</p>
      </section>
      <DataTable columns={columns} data={patients || []} />
    </div>
  );
};

export default Patients;
