/* eslint-disable @typescript-eslint/no-explicit-any */

import { email, User } from "@/assets/icons";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { GenderOptions, AccessRoles, maritialStatusOptions } from "@/constants";
import { FormFieldType } from "@/types/types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

const BasicInformations = ({ form }: Props) => {
  return (
    <div className="space-y-9">
      <section className="space-y-6">
        {/* <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div> */}

        {/* NAME */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="John"
            iconSrc={User}
            iconAlt="user"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="middleName"
            label="Middle Name"
            placeholder="Stewart"
            iconSrc={User}
            iconAlt="user"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            iconSrc={User}
            iconAlt="user"
          />
        </div>

        {/* EMAIL & PHONE */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
            iconSrc={email}
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* BirthDate & Gender */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="maritialStatus"
            label="Maritial Status"
            renderSkeleton={(field) => {
              return (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    {maritialStatusOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              );
            }}
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  {GenderOptions.map((option, i) => (
                    <div key={option + i} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        {/* Address & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder=" Software Engineer"
          />
        </div>

        <div className="">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Access Role"
            placeholder="Select Access Role"
          >
            {AccessRoles.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Staff Image "
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

export default BasicInformations;
