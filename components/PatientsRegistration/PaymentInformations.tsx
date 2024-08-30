import React, { useEffect } from "react";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FormControl } from "../ui/form";
import { stayPeriods } from "@/constants";
import { SelectItem } from "../ui/select";
import { FileUploader } from "../FileUploader";
import { Button } from "../ui/button";
import { Banknote } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { formatDate } from "@/utils/formatJSDate";

type Props = {
  form: UseFormReturn<any>;
  editProfile: boolean;
};

const PaymentInformations = ({ form, editProfile }: Props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const values = form.getValues();

  console.log(values.paymentHistory);

  console.log(values.stayPeriods);

  console.log(values);

  const handleAddPayment = (e: any) => {
    e.preventDefault();
    const paymentHistory = values.paymentHistory || [];

    const newPayment = {
      paymentReceived: values.paymentReceived,
      id: `payment-${Date.now()}`,
      formDate: new Date().toISOString(),
    };

    const newPaymentHistory = [...paymentHistory, newPayment];

    form.setValue("paymentHistory", newPaymentHistory);
  };

  return (
    <div className="space-y-9">
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Payment Information</h2>
        </div>

        {/* Conditional Fields for Initial Registration */}

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
            {stayPeriods.map((type: string, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        {values.stayPeriods && (
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
                iconSrc="/assets/icons/naira.svg"
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
      {values.stayPeriods && (
        <section>
          <Button
            onClick={handleAddPayment}
            className="flex bg-green-700 items-center gap-2"
          >
            <p>{values.paymentHistory?.length ? "Add New Payment" : "Save"}</p>{" "}
            <Banknote />
          </Button>
        </section>
      )}

      {/* Payment History */}
      {values.paymentHistory && values.paymentHistory.length > 0 && (
        <section className="space-y-4">
          <h3 className="sub-header">Payment History</h3>
          <ul className="space-y-4   ">
            {values.paymentHistory.map((payment: any, index: number) => (
              <li
                key={payment.id}
                className="space-y-4 flex flex-col border rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm capitalize text-[#7682ad] ">
                    ID: {payment.id}
                  </p>
                  <p>Date: {formatDate(payment.formDate)} </p>
                </div>

                <span>{payment.paymentReceived}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PaymentInformations;
