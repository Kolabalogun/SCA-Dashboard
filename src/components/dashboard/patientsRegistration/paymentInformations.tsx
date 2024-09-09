/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatJSDate";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { FormFieldType } from "@/types/types";
import { UseFormReturn, useWatch } from "react-hook-form";
import { stayPeriods as stayPeriodsData } from "@/constants";
import { Button } from "@/components/ui/button";
import { Banknote, Trash2Icon } from "lucide-react";
import { Naira } from "@/assets/icons";
import { uploadFileToStorage } from "@/lib/firebase";
import { useToast } from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useSelector } from "react-redux";
import { useAppContext } from "@/contexts/AppContext";
import showToast from "@/components/common/Toast";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type Props = {
  form: UseFormReturn<any>;
  patientDocId?: string;
};

const PaymentInformations = ({ form, patientDocId }: Props) => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const { adminData, getAdminContent } = useAppContext();
  const { paymentReceived, paymentHistory, paymentReceipt, name, stayPeriods } =
    form.getValues();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoader, setIsDeleteLoading] = useState<boolean>(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isDeletePaymentModalOpen, setIsDeletePaymentModalOpen] =
    useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);

  useWatch({
    control: form.control,
    name: "stayPeriods",
  });
  useWatch({
    control: form.control,
    name: "paymentHistory",
  });
  useWatch({
    control: form.control,
    name: "paymentReceived",
  });
  useWatch({
    control: form.control,
    name: "paymentReceipt",
  });
  useEffect(() => {
    getAdminContent();
  }, []);

  const handleAddPayment = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    getAdminContent();

    try {
      if (!paymentReceived)
        return showToast(
          toast,
          "Payment",
          "error",
          "Payment Amount can't be 0"
        );

      const paymentHistoryy = paymentHistory || [];

      let paymentReceiptFileUrl = "";

      if (paymentReceipt && paymentReceipt.length > 0) {
        // Upload the first file to Firebase Storage and get its URL
        paymentReceiptFileUrl = await uploadFileToStorage(
          paymentReceipt[0],
          name
        );
      }

      const newPayment = {
        paymentReceived: parseInt(paymentReceived),

        formDate: new Date().toISOString(),
        desc: `Revenue from admission of ${name} for a period of ${stayPeriods} `,
        paymentReceipt: paymentReceiptFileUrl,
        paymentRegisteredBy: `${user?.firstName} ${user?.lastName}`,
        stayPeriods: stayPeriods,
      };

      const newPaymentHistory = [...paymentHistoryy, newPayment];

      // For Revenue Addition

      const newRevenue = {
        amount: parseInt(paymentReceived),

        formDate: new Date().toISOString(),
        receipt: paymentReceiptFileUrl,
        type: "Patient Admission",
        patient: name,
        createdAt: serverTimestamp(),
        paymentRegisteredBy: `${user?.firstName} ${user?.lastName}`,
        stayPeriods: stayPeriods,
        patientDocId,
        desc: `Revenue from admission of ${name} for a period of ${stayPeriods} `,
      };

      const collectionRef = collection(db, "revenue");

      const docRef = doc(collectionRef, `revenue-${Date.now()}`);

      await setDoc(docRef, newRevenue);

      if (adminData?.totalRevenue === 0 || adminData?.totalRevenue) {
        const newRevenue =
          parseInt(adminData?.totalRevenue) + parseInt(paymentReceived);

        const newPatientRevenue =
          parseInt(adminData?.patientAdmissionRevenue) +
          parseInt(paymentReceived);

        const docRef = doc(db, "admin", "adminDoc");

        await updateDoc(docRef, {
          totalRevenue: newRevenue,
          patientAdmissionRevenue: newPatientRevenue,
        });
      }

      if (patientDocId) {
        const patientPayload = form.getValues();
        const patientRef = doc(db, "patients", patientDocId);

        await updateDoc(patientRef, patientPayload);
      }

      showToast(toast, "Payment", "success", "Payment added successfully");
      form.setValue("paymentHistory", newPaymentHistory);

      setIsAddPaymentModalOpen(false);
      getAdminContent();
    } catch (error) {
      console.log(error);
      showToast(toast, "Payment", "error", "Error adding payment");
    } finally {
      form.setValue("dateOfAdmission", new Date(Date.now()));
      form.setValue("stayPeriods", "");
      form.setValue("paymentReceived", 0);
      form.setValue("paymentReceipt", []);
      setIsLoading(false);
    }
  };

  const handleDeletePayment = async (id: string, paymentAmount: number) => {
    setIsDeleteLoading(true);
    try {
      // Filter out the payment to be deleted
      const updatedPayments = paymentHistory.filter(
        (payment: any) => payment.id !== id
      );
      // Update the patient document's payment history
      if (patientDocId) {
        const patientRef = doc(db, "patients", patientDocId);
        await updateDoc(patientRef, {
          paymentHistory: updatedPayments,
        });
      }

      // Delete the corresponding revenue document
      const revenueDocId = `revenue-${id.split("-")[1]}`; // Assuming revenue docId is similar to paymentId
      const revenueDocRef = doc(db, "revenue", revenueDocId);

      await deleteDoc(revenueDocRef);

      // Deduct the payment amount from totalRevenue
      if (adminData?.totalRevenue) {
        const updatedRevenue = parseInt(adminData.totalRevenue) - paymentAmount;

        const updatedPatientRevenue =
          parseInt(adminData.patientAdmissionRevenue) - paymentAmount;
        const adminDocRef = doc(db, "admin", "adminDoc");

        await updateDoc(adminDocRef, {
          totalRevenue: updatedRevenue,
          patientAdmissionRevenue: updatedPatientRevenue,
        });
      }

      form.setValue("paymentHistory", updatedPayments);

      showToast(toast, "Payment", "warning", "Payment deleted successfully");
      setIsDeletePaymentModalOpen(false);
    } catch (error) {
      console.log(error);
      showToast(toast, "Payment", "error", "Error deleting payment");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const confirmDeletePayment = (payment: any) => {
    setPaymentToDelete(payment);
    setIsDeletePaymentModalOpen(true);
  };

  const confirmAddPayment = () => {
    setIsAddPaymentModalOpen(true);
  };

  return (
    <div className="space-y-9">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isAddPaymentModalOpen}
        onConfirm={handleAddPayment}
        onCancel={() => setIsAddPaymentModalOpen(false)}
        isLoading={isLoading}
        title="Confirm Payment"
        message="Are you sure you want to add this payment?"
      />

      <ConfirmationModal
        isOpen={isDeletePaymentModalOpen}
        onConfirm={() =>
          handleDeletePayment(
            paymentToDelete?.id,
            paymentToDelete?.paymentReceived
          )
        }
        onCancel={() => setIsDeletePaymentModalOpen(false)}
        isLoading={deleteLoader}
        title="Delete Payment"
        message="Are you sure you want to delete this payment?"
      />
      <section className="space-y-6">
        {/* Payment History */}
        {paymentHistory && paymentHistory.length > 0 && (
          <section className="space-y-6">
            <h3 className="sub-header">Payment History</h3>
            <ul className="space-y-4   ">
              {paymentHistory?.map((payment: any) => (
                <li
                  key={payment?.id}
                  className="space-y-4 flex flex-col border border-[#363a3d] rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm capitalize text-[#7682ad] ">
                      ID: {payment?.id}
                    </p>
                    <p className="text-sm">
                      Date: {formatDate(payment?.formDate) || "N/A"}{" "}
                    </p>
                  </div>

                  <div className="  items-center flex gap-2">
                    <p className="text-xs">Payment Approved By: </p>
                    <p className="text-[13px]">
                      {payment?.paymentRegisteredBy}{" "}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Admission Period: </p>
                    <p>{payment?.stayPeriods} </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Amount Received: </p>
                    <p>
                      ₦{parseInt(payment?.paymentReceived)?.toLocaleString()}{" "}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Payment Description: </p>
                    <p>{payment?.desc} </p>
                  </div>

                  <div className="flex my-2 items-center justify-between">
                    {payment?.paymentReceipt && (
                      <div className=" ">
                        <Button
                          type="button"
                          className="bg-blue-700"
                          onClick={() =>
                            window.open(payment?.paymentReceipt, "_blank")
                          }
                        >
                          View Reciept
                        </Button>
                      </div>
                    )}

                    <Button
                      type="button"
                      className="bg-red-800 gap-2"
                      onClick={() => confirmDeletePayment(payment)}
                    >
                      Delete <Trash2Icon className="h-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Payment Information</h2>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="dateOfAdmission"
            label="Date of Admission"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="stayPeriods"
            label="Estimated Admission Period"
            placeholder="Select Period of Stay"
          >
            {stayPeriodsData.map((type: string, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        {stayPeriods && (
          <>
            {/* Payment Fields */}
            <div className="flex flex-col gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="paymentReceived"
                type="number"
                label="Payment Received"
                placeholder="0"
                iconSrc={Naira}
                iconAlt="naira"
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="paymentReceipt"
              label="Add Payment Receipt (if any)"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </>
        )}
      </section>

      {/* Add Payment Button */}
      {stayPeriods && (
        <section>
          <Button
            type="button"
            onClick={confirmAddPayment}
            disabled={isLoading}
            className="flex bg-green-700 items-center gap-2"
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>{paymentHistory?.length ? "Add New Payment" : "Save"}</p>
            )}
            <Banknote />
          </Button>
        </section>
      )}
    </div>
  );
};

export default PaymentInformations;
