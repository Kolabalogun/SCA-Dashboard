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
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import { sendEmail } from "@/services/email";

const RevenueDetails = () => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);

  const navigate = useNavigate();
  const { adminData, getAdminContent, adminEmails, fetchStaffs } =
    useAppContext();
  const { id: docId } = useParams();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [deleteLoader, setIsDeleteLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

          const revenueData = { createdAt, ...others };
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
    fetchStaffs();
  }, [docId]);

  const handleDeleteRevenue = async (id: string, amount: number) => {
    setIsDeleteLoading(true);
    try {
      const res = await fetchFirestoreData<any>(
        "patients",
        revenue?.patientDocId
      );
      if (res) {
        const updatedPayments = res?.paymentHistory.filter(
          (payment: any) => payment.id !== id
        );

        if (revenue?.patientDocId) {
          const patientRef = doc(db, "patients", revenue?.patientDocId);
          await updateDoc(patientRef, { paymentHistory: updatedPayments });
        }
      }

      const revenueDocRef = doc(db, "revenue", revenue?.id);
      await deleteDoc(revenueDocRef);

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
          await updateDoc(adminDocRef, { otherRevenue: updatedOtherRevenue });
        }

        await updateDoc(adminDocRef, { totalRevenue: updatedRevenue });
      }

      const activitesRef = doc(db, "activites", `activity-${Date.now()}`);

      // Update Activity
      const dataa = {
        title: "Revenue Deletion",
        activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
        activtyCarriedOutEmailBy: `${user?.email}`,

        createdAt: serverTimestamp(),
        formDate: new Date().toISOString(),
        type: "Deletion",
        desc: `Revenue with ID: ${revenue?.id}, titled "${
          revenue?.desc
        }" and amounting to ₦${parseInt(
          revenue?.amount
        )?.toLocaleString()} was deleted by ${user?.firstName} ${
          user?.lastName
        }. Initially, this payment was approved by ${
          revenue?.paymentRegisteredBy || revenue?.registeredBy
        } on ${formatDate(revenue?.formDate) || "N/A"}`,
      };

      await setDoc(activitesRef, dataa);

      const emailData = {
        emails: [user?.email],
        subject: `You just deleted a Revenue on ${
          revenue?.type
        } amounting to ₦${parseInt(
          revenue?.amount as string
        )?.toLocaleString()}.`,
        message: `Revenue with ID: ${revenue?.id}, titled "${
          revenue?.desc
        }" and amounting to ₦${parseInt(
          revenue?.amount
        )?.toLocaleString()} was deleted by you. Initially, this payment was approved by ${
          revenue?.paymentRegisteredBy || revenue?.registeredBy
        } on ${formatDate(revenue?.formDate) || "N/A"}`,
      };

      const adminEmailData = {
        emails: adminEmails,
        subject: `New Revenue for ${revenue?.type} `,
        message: `Revenue with ID: ${revenue?.id}, titled "${
          revenue?.desc
        }" and amounting to ₦${parseInt(
          revenue?.amount
        )?.toLocaleString()} was deleted by ${user?.firstName} ${
          user?.lastName
        }. Initially, this payment was approved by ${
          revenue?.paymentRegisteredBy || revenue?.registeredBy
        } on ${formatDate(revenue?.formDate) || "N/A"}`,
      };

      const message = await sendEmail(emailData);
      const adminMessage = await sendEmail(adminEmailData);
      console.log("Email sent successfully:", message);
      console.log("Admin Email sent successfully:", adminMessage);

      showToast(toast, "SCA", "warning", "Revenue deleted successfully");
      getAdminContent();
      navigate("/dashboard/revenue");
    } catch (error) {
      console.log(error);
      showToast(toast, "SCA", "error", "Error deleting revenue");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="container flex flex-col">
      <div className="flex flex-col space-y-14">
        <main>
          <section className="w-full space-y-4 mb-8">
            <h1 className="header">Revenue Details</h1>
            <p className="text-dark-700">Revenue ID: {revenue?.id}</p>
          </section>

          <section className="w-full mb-8">
            <li
              key={revenue?.id}
              className="space-y-4 flex flex-col border border-[#363a3d] rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm capitalize text-[#7682ad]">
                  ID: {revenue?.id}
                </p>
                <p className="text-sm">
                  Date: {formatDate(revenue?.createdAt) || "N/A"}
                </p>
              </div>

              <div className="items-center flex gap-2">
                <p className="text-sm">Revenue Approved By:</p>
                <p className="text-sm">
                  {revenue?.paymentRegisteredBy || revenue?.registeredBy}
                </p>
              </div>

              {revenue?.stayPeriod && (
                <div className="space-y-2">
                  <p className="text-sm">Admission Period:</p>
                  <p>{revenue?.stayPeriods}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm">Amount Received:</p>
                <p>₦{parseInt(revenue?.amount)?.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Payment Description:</p>
                <p>{revenue?.desc}</p>
              </div>

              <div className="flex my-2 items-center justify-between">
                {revenue?.receipt && (
                  <div>
                    <Button
                      type="button"
                      className="bg-blue-700"
                      onClick={() => window.open(revenue?.receipt, "_blank")}
                    >
                      View Receipt
                    </Button>
                  </div>
                )}

                {user && user?.accessRole === AccessRole.Admin && (
                  <Button
                    type="button"
                    className="bg-red-800 gap-2"
                    onClick={openDeleteModal}
                  >
                    Delete <Trash2Icon className="h-5" />
                  </Button>
                )}
              </div>
            </li>
          </section>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={() => handleDeleteRevenue(revenue.id, revenue.amount)}
        onCancel={closeDeleteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this revenue?"
        isLoading={deleteLoader}
      />
    </div>
  );
};

export default RevenueDetails;
