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
import showToast from "@/components/common/Toast";
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

const AddOtherRevenue = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { adminData, getAdminContent } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollToTop();
    getAdminContent();
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

    try {
      if (user?.role === AccessRole.Viewer)
        return showToast(
          toast,
          "Access Denied",
          "warning",
          "You don't have access to perform this action"
        );

      console.log(values);
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

      const collectionRef = collection(db, "revenue");

      const docRef = doc(collectionRef, `revenue-${Date.now()}`);

      await setDoc(docRef, data);

      if (
        (adminData?.totalRevenue === 0 || adminData?.totalRevenue) &&
        amount
      ) {
        const newRevenue =
          parseInt(adminData?.totalRevenue) + parseInt(amount as string);

        const newOtherRevenue =
          parseInt(adminData?.otherRevenue) + parseInt(amount as string);

        const docRef = doc(db, "admin", "adminDoc");

        await updateDoc(docRef, {
          totalRevenue: newRevenue,
          otherRevenue: newOtherRevenue,
        });
      }

      showToast(toast, "Registration", "success", "Revenue successfully Added");
      getAdminContent();
      setIsLoading(false);
      navigate("/dashboard/revenue");

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      showToast(toast, "Registration", "error", "Error updating income data");
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
        <div className="flex flex-col  space-y-14">
          <main>
            <section className="w-full space-y-4 mb-8">
              <h1 className="header ">Hi there 👋</h1>
              <p className="text-dark-700">Enter Income Informations</p>
            </section>

            <form
              onSubmit={(e: any) => {
                e.preventDefault();

                setIsAddPaymentModalOpen(true);
              }}
              className="flex-1 space-y-12"
            >
              <AddRevenueForm form={form} />

              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </form>
          </main>
        </div>
      </Form>
    </div>
  );
};

export default AddOtherRevenue;
