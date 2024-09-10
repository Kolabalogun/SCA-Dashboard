/* eslint-disable @typescript-eslint/no-explicit-any */

import { email, Key, User } from "@/assets/icons";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  GenderOptions,
  AccessRoles,
  maritialStatusOptions,
  StaffOccupations,
} from "@/constants";
import { AccessRole, FormFieldType } from "@/types/types";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

type Props = {
  form: UseFormReturn<any>;
  userId?: string;
};

const BasicInformations = ({ form, userId }: Props) => {
  useWatch({
    control: form.control,
    name: "accessRole",
  });

  const { user } = useSelector((state: any) => state.auth);

  const values = form.getValues();

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
            readOnly={
              userId && user && user?.accessRole !== AccessRole.Admin && true
            }
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
            readOnly={
              userId && user && user?.accessRole !== AccessRole.Admin && true
            }
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            readOnly={
              userId && user && user?.accessRole !== AccessRole.Admin && true
            }
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
            readOnly={userId ? true : false}
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
            disabled={
              userId && user && user?.accessRole !== AccessRole.Admin && true
            }
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
            disabled={
              userId && user && user?.accessRole !== AccessRole.Admin && true
            }
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
            readOnly={
              userId && user && user?.accessRole !== AccessRole.Admin && true
            }
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Select Staff Occupation"
          >
            {StaffOccupations.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <div className="">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="accessRole"
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
          name="staffImage"
          label="Staff Image "
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        {values.accessRole !== "No Access" && !userId && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            readOnly={userId ? true : false}
            name="password"
            label="Enter Staff Password"
            placeholder="***********"
            iconSrc={Key}
            iconAlt="user"
          />
        )}

        {values.accessRole !== "No Access" && !userId && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            readOnly={userId ? true : false}
            name="confirmPassword"
            label="Confirm Staff Password"
            placeholder="***********"
            iconSrc={Key}
            iconAlt="user"
          />
        )}
      </section>
    </div>
  );
};

export default BasicInformations;
