/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from "@/components/common/Loader";
import showToast from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { useAppContext } from "@/contexts/AppContext";
import { fetchFirestoreData } from "@/lib/firebase";
import { sendEmail } from "@/services/email";
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

const ExpenseDetails = () => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);

  const navigate = useNavigate();
  const { adminData, getAdminContent, adminEmails, fetchStaffs } =
    useAppContext();
  const { id: docId } = useParams();

  const [loading, setIsLoading] = useState<boolean>(false);

  const [expenses, setExpenses] = useState<any>(null);

  useEffect(() => {
    const getExpensesDoc = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFirestoreData<any>("expenses", docId);

        if (res) {
          const { createdAt: createdAtTimestamp, ...others } = res;

          const createdAt =
            createdAtTimestamp instanceof Timestamp
              ? createdAtTimestamp.toDate()
              : createdAtTimestamp;

          // Use 'const' for 'others' since it's not reassigned
          const expensesData = {
            createdAt,
            ...others,
          };

          setExpenses(expensesData);
        } else {
          console.log("No expenses document found");
        }
      } catch (error) {
        console.log("Error fetching expenses document:", error);
        showToast(toast, "SCA", "error", "Error fetching expenses document");
      } finally {
        setIsLoading(false);
      }
    };

    if (docId) {
      getExpensesDoc();
      getAdminContent();
    }
    fetchStaffs();
  }, [docId]);

  const handleDeleteExpenses = async (id: string, amount: number) => {
    try {
      const ExpensesDocRef = doc(db, "expenses", id);

      await deleteDoc(ExpensesDocRef);

      // Deduct the payment amount from totalExpenses
      if (adminData?.totalExpenses) {
        const updatedExpenses = parseInt(adminData.totalExpenses) - amount;

        const adminDocRef = doc(db, "admin", "adminDoc");

        await updateDoc(adminDocRef, {
          totalExpenses: updatedExpenses,
        });
      }

      const activitesRef = doc(db, "activites", `activity-${Date.now()}`);

      // Update Activity
      const dataa = {
        title: "Expenses Deletion",
        activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
        activtyCarriedOutEmailBy: `${user?.email}`,
        createdAt: serverTimestamp(),
        formDate: new Date().toISOString(),
        type: "Deletion",
        desc: `Expense with ID: ${expenses?.id}, titled "${
          expenses?.desc
        }" and amounting to ₦${parseInt(
          expenses?.amount
        )?.toLocaleString()} was deleted by ${user?.firstName} ${
          user?.lastName
        }. Initially, this payment was approved by ${
          expenses?.paymentRegisteredBy || expenses?.registeredBy
        } on ${formatDate(expenses?.formDate) || "N/A"}`,
      };

      await setDoc(activitesRef, dataa);

      const emailData = {
        emails: [user?.email],
        subject: `You just deleted an Expenses on ${expenses?.type} `,
        message: `Expense with ID: ${expenses?.id}, titled "${
          expenses?.desc
        }" and amounting to ₦${parseInt(
          expenses?.amount
        )?.toLocaleString()} was deleted by you. Initially, this payment was approved by ${
          expenses?.paymentRegisteredBy || expenses?.registeredBy
        } on ${formatDate(expenses?.formDate) || "N/A"}`,
      };

      const adminEmailData = {
        emails: adminEmails,
        subject: `New Expenses for ${expenses?.type} `,
        message: `Expense with ID: ${expenses?.id}, titled "${
          expenses?.desc
        }" and amounting to ₦${parseInt(
          expenses?.amount
        )?.toLocaleString()} was deleted by ${user?.firstName} ${
          user?.lastName
        }. Initially, this payment was approved by ${
          expenses?.paymentRegisteredBy || expenses?.registeredBy
        } on ${formatDate(expenses?.formDate) || "N/A"}`,
      };

      const message = await sendEmail(emailData);
      const adminMessage = await sendEmail(adminEmailData);
      console.log("Email sent successfully:", message);
      console.log("Admin Email sent successfully:", adminMessage);

      showToast(toast, "SCA", "warning", "Expense deleted successfully");

      getAdminContent();

      navigate("/dashboard/Expenses");
    } catch (error) {
      console.log(error);
      showToast(toast, "SCA", "error", "Error deleting Expenses");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container    flex flex-col  ">
      <div className="flex flex-col mb-10   space-y-14">
        <main>
          <section className="w-full space-y-4 mb-8">
            <h1 className="header ">Expenses Details</h1>
            <p className="text-dark-700">ID: {expenses?.id}</p>
          </section>

          <section className="w-full mb-8">
            <li
              key={expenses?.id}
              className="space-y-4 flex flex-col border border-[#363a3d] rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm capitalize text-[#7682ad] ">
                  ID: {expenses?.id}
                </p>
                <p className="text-sm">
                  Date: {formatDate(expenses?.formDate) || "N/A"}
                </p>
              </div>

              <div className="  items-center flex gap-2">
                <p className="text-sm">Payment Approved By: </p>
                <p className="text-sm">
                  {expenses?.paymentRegisteredBy || expenses?.registeredBy}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Amount Paid: </p>
                <p>₦{parseInt(expenses?.amount)?.toLocaleString()} </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Payment Description: </p>
                <p>{expenses?.desc} </p>
              </div>

              <div className="flex my-2 items-center justify-between">
                {expenses?.receipt && (
                  <div className=" ">
                    <Button
                      type="button"
                      className="bg-blue-700"
                      onClick={() => window.open(expenses?.receipt, "_blank")}
                    >
                      View Reciept
                    </Button>
                  </div>
                )}

                {user && user?.accessRole === AccessRole.Admin && (
                  <Button
                    type="button"
                    className="bg-red-800 gap-2"
                    onClick={() =>
                      handleDeleteExpenses(expenses.id, expenses.amount)
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

export default ExpenseDetails;
