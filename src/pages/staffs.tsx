/* eslint-disable @typescript-eslint/no-explicit-any */
import TableLoader from "@/components/common/TableLoader";
import { staffsColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Staffs = () => {
  const navigate = useNavigate();

  const [staffs, setstaffs] = useState<any>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  async function fetchstaffs() {
    const staffsRef = collection(db, "staffs");
    setLoading(true);

    try {
      const q = query(staffsRef, orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const staffs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setstaffs(staffs);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setstaffs([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchstaffs();
  }, []);

  return (
    <div className=" flex flex-col space-y-14">
      <section className="w-full flex justify-between items-center  ">
        <div className="space-y-4">
          <h1 className="header">Staffs</h1>
          <p className="text-dark-700">All Staffs Records</p>
        </div>

        <div className="">
          <Button
            onClick={() => navigate("/dashboard/register-staff")}
            className="bg-green-700 text-white"
          >
            Add New Staff
          </Button>
        </div>
      </section>
      {isLoading ? (
        <TableLoader />
      ) : (
        <DataTable columns={staffsColumns} data={staffs || []} />
      )}
    </div>
  );
};

export default Staffs;
