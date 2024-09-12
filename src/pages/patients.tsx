/* eslint-disable @typescript-eslint/no-explicit-any */
import TableLoader from "@/components/common/TableLoader";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { AccessRole } from "@/types/types";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [patients, setPatients] = useState<any>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

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
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className=" flex flex-col space-y-14">
      <section className="w-full flex justify-between items-center  ">
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
      {isLoading ? (
        <TableLoader />
      ) : (
        <DataTable columns={columns} data={patients || []} />
      )}
    </div>
  );
};

export default Patients;
