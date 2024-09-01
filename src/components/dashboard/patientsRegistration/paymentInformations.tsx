/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

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
import showToast from "@/components/common/toast";

type Props = {
  form: UseFormReturn<any>;
  editProfile: boolean;
};

const PaymentInformations = ({ form, editProfile }: Props) => {
  const toast = useToast();

  const { paymentReceived, paymentHistory, paymentReceipt, name, stayPeriods } =
    form.getValues();

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

  console.log(paymentReceipt);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddPayment = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

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
        paymentReceived: paymentReceived,
        id: `payment-${Date.now()}`,
        formDate: new Date().toISOString(),
        stayPeriods: stayPeriods,
        paymentReceipt: paymentReceiptFileUrl,
      };

      const newPaymentHistory = [...paymentHistoryy, newPayment];

      form.setValue("paymentHistory", newPaymentHistory);
      showToast(toast, "Payment", "success", "Payment added successfully");
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

  const handleDeletePayment = (id: string) => {
    const updatedPayments = paymentHistory.filter(
      (payment: any) => payment.id !== id
    );

    form.setValue("paymentHistory", updatedPayments);
    showToast(toast, "Payment", "error", "Payment deleted successfully");
  };

  return (
    <div className="space-y-9">
      <section className="space-y-6">
        {/* Payment History */}
        {paymentHistory && paymentHistory.length > 0 && (
          <section className="space-y-6">
            <h3 className="sub-header">Payment History</h3>
            <ul className="space-y-4   ">
              {paymentHistory?.map((payment: any) => (
                <li
                  key={payment.id}
                  className="space-y-4 flex flex-col border border-[#363a3d] rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm capitalize text-[#7682ad] ">
                      ID: {payment.id}
                    </p>
                    <p className="text-sm">
                      Date: {formatDate(payment.formDate)}{" "}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Admission Period: </p>
                    <p>{payment.stayPeriods} </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Amount Received: </p>
                    <p>
                      ₦{parseInt(payment.paymentReceived)?.toLocaleString()}{" "}
                    </p>
                  </div>

                  <div className="flex my-2 items-center justify-between">
                    {payment?.paymentReceipt && (
                      <div className=" ">
                        <Button
                          type="button"
                          className="bg-blue-700"
                          onClick={() =>
                            window.open(payment.paymentReceipt, "_blank")
                          }
                        >
                          View Reciept
                        </Button>
                      </div>
                    )}

                    <Button
                      type="button"
                      className="bg-red-800 gap-2"
                      onClick={() => handleDeletePayment(payment.id)}
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
            readOnly={!editProfile}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="stayPeriods"
            label="Estimated Admission Period"
            placeholder="Select Period of Stay"
            readOnly={!editProfile}
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
                readOnly={!editProfile}
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
            onClick={handleAddPayment}
            disabled={isLoading}
            className="flex bg-green-700 items-center gap-2"
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>{paymentHistory?.length ? "Add New Payment" : "Save"}</p>
            )}{" "}
            <Banknote />
          </Button>
        </section>
      )}
    </div>
  );
};

export default PaymentInformations;
