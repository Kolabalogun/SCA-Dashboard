/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatJSDate";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { AccessRole, FormFieldType } from "@/types/types";
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
import showToast from "@/components/common/toast";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { sendEmail } from "@/services/email";

type Props = {
  form: UseFormReturn<any>;
  patientDocId?: string;
};

const PaymentInformations = ({ form, patientDocId }: Props) => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const { adminData, getAdminContent, adminEmails } = useAppContext();
  const { paymentReceived, paymentHistory, name, stayPeriods } =
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
      const { paymentReceipt, ...others } = form.getValues();
      const paymentHistoryy = paymentHistory || [];

      let paymentReceiptFileUrl = "";

      if (paymentReceipt && paymentReceipt.length > 0) {
        // Upload the first file to Firebase Storage and get its URL
        paymentReceiptFileUrl = await uploadFileToStorage(
          "paymentReceipt",
          paymentReceipt[0],
          name
        );
      }

      const revenueId = `revenue-${Date.now()}`;

      const newPayment = {
        paymentReceived: parseInt(paymentReceived),
        revenueId,
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
        revenueId,
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

      const docRef = doc(collectionRef, revenueId);

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
        const patientPayload = {
          ...others,

          paymentHistory: newPaymentHistory,
        };

        const patientRef = doc(db, "patients", patientDocId);

        await updateDoc(patientRef, patientPayload);

        try {
          const emailData = {
            emails: [user?.email],
            subject: `New Revenue from Patient Admission`,
            message: `You added a New Revenue from Patient Admission amounting to ₦${parseInt(
              paymentReceived as string
            )?.toLocaleString()} from ${name}. Stay Periods: ${
              stayPeriods || "N/A"
            }.`,
          };

          const adminEmailData = {
            emails: adminEmails,
            subject: `New Revenue from Patient Admission `,
            message: `New Revenue added from Patient Admission performed by ${
              user?.firstName
            } ${user?.lastName} amounting to ₦${parseInt(
              paymentReceived as string
            )?.toLocaleString()} from ${name}. Stay Periods: ${
              stayPeriods || "N/A"
            }.`,
          };
          const message = await sendEmail(emailData);
          const adminMessage = await sendEmail(adminEmailData);
          console.log("Email sent successfully:", message);
          console.log("Admin Email sent successfully:", adminMessage);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          showToast(
            toast,
            "Email Error",
            "warning",
            "Payment added, but email failed to send."
          );
        }

        showToast(toast, "Payment", "success", "Payment added successfully");
        form.setValue("paymentHistory", newPaymentHistory);
      }

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
  console.log(paymentToDelete);

  const handleDeletePayment = async () => {
    setIsDeleteLoading(true);
    try {
      // Filter out the payment to be deleted
      const updatedPayments = paymentHistory.filter(
        (payment: any) => payment.revenueId !== paymentToDelete?.revenueId
      );
      // Update the patient document's payment history
      if (patientDocId) {
        const patientRef = doc(db, "patients", patientDocId);
        await updateDoc(patientRef, {
          paymentHistory: updatedPayments,
        });
      }

      console.log(paymentToDelete?.revenueId);

      const revenueDocRef = doc(db, "revenue", paymentToDelete?.revenueId);

      await deleteDoc(revenueDocRef);

      // Deduct the payment amount from totalRevenue
      if (adminData?.totalRevenue) {
        const updatedRevenue =
          parseInt(adminData.totalRevenue) - paymentToDelete?.paymentAmount;

        const updatedPatientRevenue =
          parseInt(adminData.patientAdmissionRevenue) -
          paymentToDelete?.paymentAmount;
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

      {/* Delete Modal  */}
      <ConfirmationModal
        isOpen={isDeletePaymentModalOpen}
        onConfirm={() => handleDeletePayment()}
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
                    {/* <p className="text-sm capitalize text-[#7682ad] ">
                      ID: {payment?.id}
                    </p> */}
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

                    {user && user?.accessRole === AccessRole.Admin && (
                      <Button
                        type="button"
                        className="bg-red-800 gap-2"
                        onClick={() => confirmDeletePayment(payment)}
                      >
                        Delete <Trash2Icon className="h-5" />
                      </Button>
                    )}
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
                <p className="text-white capitalize">{type}</p>
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
