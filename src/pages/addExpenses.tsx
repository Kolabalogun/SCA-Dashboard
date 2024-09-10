/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SubmitButton from "@/components/common/SubmitButton";
import AddRevenueForm from "@/components/dashboard/revenue/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { AddRevenueValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { AddRevenueDefaultValues } from "@/constants";
import showToast from "@/components/common/toast";
import { AccessRole } from "@/types/types";
import { uploadFileToStorage } from "@/lib/firebase";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAppContext } from "@/contexts/AppContext";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { sendEmail } from "@/services/email";

const AddExpenses = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { adminData, getAdminContent, adminEmails, fetchStaffs } =
    useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollToTop();
    getAdminContent();
    fetchStaffs();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const form = useForm<z.infer<typeof AddRevenueValidation>>({
    resolver: zodResolver(AddRevenueValidation),
    defaultValues: AddRevenueDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof AddRevenueValidation>) => {
    setIsLoading(true);

    const activitesRef = doc(db, "activites", `activity-${Date.now()}`);

    try {
      if (user?.role === AccessRole.Viewer)
        return showToast(
          toast,
          "Access Denied",
          "warning",
          "You don't have access to perform this action"
        );

      const { receipt, patient, amount } = values;

      if (!amount)
        return showToast(toast, "SCA", "error", "Amount can't be empty!");

      let fileUrl = "";

      if (receipt && receipt.length > 0) {
        // Upload the first file to Firebase Storage and get its URL
        fileUrl = await uploadFileToStorage(receipt[0], patient);
      }

      const data = {
        ...values,
        paymentRegisteredBy: `${user?.firstName} ${user?.lastName}`,
        createdAt: serverTimestamp(),
        receipt: fileUrl ? fileUrl : "",
      };

      const collectionRef = collection(db, "expenses");

      const docRef = doc(collectionRef, `expenses-${Date.now()}`);

      await setDoc(docRef, data);

      if (
        (adminData?.totalExpenses === 0 || adminData?.totalExpenses) &&
        amount
      ) {
        const newExpenses =
          parseInt(adminData?.totalExpenses) + parseInt(amount as string);

        const docRef = doc(db, "admin", "adminDoc");

        await updateDoc(docRef, {
          totalExpenses: newExpenses,
        });
      }

      // Update Activity
      const dataa = {
        title: "New Expenses",
        activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
        activtyCarriedOutEmailBy: `${user?.email}`,
        createdAt: serverTimestamp(),
        formDate: new Date().toISOString(),
        type: "Expenses",
        desc: `New Expenses cost ₦${parseInt(
          values?.amount as string
        )?.toLocaleString()} on ${values?.type} paid to ${values.patient}. `,
      };

      await setDoc(activitesRef, dataa);

      const emailData = {
        emails: [user?.email],
        subject: `New Expenses on ${values?.type} `,
        message: `You carried out New Expenses cost ₦${parseInt(
          values?.amount as string
        )?.toLocaleString()} on ${values?.type}. Paid to ${
          values.patient
        }. Description: ${values.desc}  `,
      };

      const adminEmailData = {
        emails: adminEmails,
        subject: `New Expenses on ${values?.type} `,
        message: `New Expenses cost ₦${parseInt(
          values?.amount as string
        )?.toLocaleString()} on ${values?.type} performed by ${
          user?.firstName
        } ${user?.lastName}. Paid to ${values.patient}. Description: ${
          values.desc
        } `,
      };

      const message = await sendEmail(emailData);
      const adminMessage = await sendEmail(adminEmailData);
      console.log("Email sent successfully:", message);
      console.log("Admin Email sent successfully:", adminMessage);

      showToast(
        toast,
        "Registration",
        "success",
        "Expenses successfully Added"
      );
      getAdminContent();
      setIsLoading(false);
      navigate("/dashboard/Expenses");

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      showToast(toast, "Registration", "error", "Error updating expense data");
    } finally {
      setIsLoading(false);
    }
  };

  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

  return (
    <div className="container    flex flex-col  ">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isAddPaymentModalOpen}
        onConfirm={form.handleSubmit(onSubmit)}
        onCancel={() => setIsAddPaymentModalOpen(false)}
        isLoading={isLoading}
        title="Confirm Payment"
        message="Are you sure you want to add payment?"
      />
      <Form {...form}>
        <div className="flex flex-col mb-10   space-y-14">
          <main>
            <section className="w-full space-y-4 mb-8">
              <h1 className="header ">Hi there 👋</h1>
              <p className="text-dark-700">Enter Expense Informations</p>
            </section>

            <form
              onSubmit={(e: any) => {
                e.preventDefault();

                setIsAddPaymentModalOpen(true);
              }}
              className="flex-1 space-y-12"
            >
              <AddRevenueForm form={form} type="expenses" />

              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </form>
          </main>
        </div>
      </Form>
    </div>
  );
};

export default AddExpenses;
