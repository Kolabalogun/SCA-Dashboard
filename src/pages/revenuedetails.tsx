/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from "@/components/common/Loader";
import showToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { useAppContext } from "@/contexts/AppContext";
import { fetchFirestoreData } from "@/lib/firebase";
import { AccessRole } from "@/types/types";
import { formatDate } from "@/utils/formatJSDate";
import { useToast } from "@chakra-ui/react";
import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const RevenueDetails = () => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);

  const navigate = useNavigate();
  const { adminData, getAdminContent } = useAppContext();
  const { id: docId } = useParams();
  const [loading, setIsLoading] = useState<any>(null);

  const [revenue, setRevenue] = useState<any>(null);

  useEffect(() => {
    const getRevenueDoc = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFirestoreData<any>("revenue", docId);

        if (res) {
          const { createdAt: createdAtTimestamp, ...others } = res;

          const createdAt =
            createdAtTimestamp instanceof Timestamp
              ? createdAtTimestamp.toDate()
              : createdAtTimestamp;

          // Use 'const' for 'others' since it's not reassigned
          const revenueData = {
            createdAt,
            ...others,
          };

          setRevenue(revenueData);
        } else {
          console.log("No Revenue document found");
        }
      } catch (error) {
        console.log("Error fetching Revenue document:", error);
        showToast(toast, "SCA", "error", "Error fetching Revenue document");
      } finally {
        setIsLoading(false);
      }
    };

    if (docId) {
      getRevenueDoc();
      getAdminContent();
    }
  }, [docId]);

  const handleDeleteRevenue = async (id: string, amount: number) => {
    try {
      // Get Patient Documemt

      const res = await fetchFirestoreData<any>(
        "patients",
        revenue?.patientDocId
      );

      if (res) {
        // Filter out the payment to be deleted
        const updatedPayments = res?.paymentHistory.filter(
          (payment: any) => payment.id !== id
        );

        // Update the patient document's payment history
        if (revenue?.patientDocId) {
          const patientRef = doc(db, "patients", revenue?.patientDocId);
          await updateDoc(patientRef, {
            paymentHistory: updatedPayments,
          });
        }
      }

      // Delete the corresponding revenue document

      const revenueDocRef = doc(db, "revenue", revenue?.id);

      await deleteDoc(revenueDocRef);

      // Deduct the payment amount from totalRevenue
      if (adminData?.totalRevenue) {
        const updatedRevenue = parseInt(adminData.totalRevenue) - amount;

        const adminDocRef = doc(db, "admin", "adminDoc");

        if (revenue?.type === "Patient Admission") {
          const updatedPatientRevenue =
            parseInt(adminData.patientAdmissionRevenue) - amount;

          await updateDoc(adminDocRef, {
            patientAdmissionRevenue: updatedPatientRevenue,
          });
        } else {
          const updatedOtherRevenue = parseInt(adminData.otherRevenue) - amount;

          await updateDoc(adminDocRef, {
            otherRevenue: updatedOtherRevenue,
          });
        }

        await updateDoc(adminDocRef, {
          totalRevenue: updatedRevenue,
        });
      }

      showToast(toast, "SCA", "warning", "Revenue deleted successfully");

      getAdminContent();

      navigate("/dashboard/revenue");
    } catch (error) {
      console.log(error);
      showToast(toast, "SCA", "error", "Error deleting revenue");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container    flex flex-col  ">
      <div className="flex flex-col  space-y-14">
        <main>
          <section className="w-full space-y-4 mb-8">
            <h1 className="header ">Revenue Details</h1>
            <p className="text-dark-700">Revenue ID: {revenue?.id}</p>
          </section>

          <section className="w-full mb-8">
            <li
              key={revenue?.id}
              className="space-y-4 flex flex-col border border-[#363a3d] rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm capitalize text-[#7682ad] ">
                  ID: {revenue?.id}
                </p>
                <p className="text-sm">
                  Date: {formatDate(revenue?.formDate) || "N/A"}
                </p>
              </div>

              <div className="  items-center flex gap-2">
                <p className="text-sm">Pevenue Approved By: </p>
                <p className="text-sm">
                  {revenue?.paymentRegisteredBy || revenue?.registeredBy}{" "}
                </p>
              </div>

              {revenue?.stayPeriod && (
                <div className="space-y-2">
                  <p className="text-sm">Admission Period: </p>
                  <p>{revenue?.stayPeriods} </p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm">Amount Received: </p>
                <p>₦{parseInt(revenue?.amount)?.toLocaleString()} </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Payment Description: </p>
                <p>{revenue?.desc} </p>
              </div>

              <div className="flex my-2 items-center justify-between">
                {revenue?.receipt && (
                  <div className=" ">
                    <Button
                      type="button"
                      className="bg-blue-700"
                      onClick={() => window.open(revenue?.receipt, "_blank")}
                    >
                      View Reciept
                    </Button>
                  </div>
                )}

                {user && user?.role === AccessRole.Admin && (
                  <Button
                    type="button"
                    className="bg-red-800 gap-2"
                    onClick={() =>
                      handleDeleteRevenue(revenue.id, revenue.amount)
                    }
                  >
                    Delete <Trash2Icon className="h-5" />
                  </Button>
                )}
              </div>
            </li>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RevenueDetails;
