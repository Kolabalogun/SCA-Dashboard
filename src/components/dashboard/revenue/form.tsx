/* eslint-disable @typescript-eslint/no-explicit-any */

import { Naira } from "@/assets/icons";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { RevenueTypeOptions } from "@/constants";
import { FormFieldType } from "@/types/types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

const AddRevenueForm = ({ form }: Props) => {
  return (
    <div className="space-y-9">
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Revenue Informations</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="type"
          label="Type of Revenue"
          placeholder="Select type of Revenue"
        >
          {RevenueTypeOptions.map((type, i) => (
            <SelectItem key={type + i} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="patient"
          label="From"
          placeholder="Enter revenue source"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="amount"
          label="Amount"
          placeholder="Amount"
          type="number"
          iconSrc={Naira}
          iconAlt="naira"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="desc"
          label="Payment Description"
          placeholder="Enter Payment Description"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="receipt"
          label="Payment Receipt (if any)"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
      </section>
    </div>
  );
};

export default AddRevenueForm;
