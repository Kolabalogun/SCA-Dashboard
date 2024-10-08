/* eslint-disable @typescript-eslint/no-explicit-any */

import { email, User } from "@/assets/icons";
import { DrCruz } from "@/assets/images";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  GenderOptions,
  IdentificationTypes,
  maritialStatusOptions,
  PatientStatusOption,
} from "@/constants";
import { FormFieldType } from "@/types/types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
  staffs: any[];
  userId: string;
};

const BasicInformations = ({ form, staffs, userId }: Props) => {
  return (
    <div className="space-y-9">
      <section className="space-y-6">
        <div className="mb-9 space-y-2">
          <h2 className="sub-header">Personal Information</h2>
          {userId && (
            <p className="text-gray-300 text-[13px] ">Patient ID: {userId} </p>
          )}
        </div>

        {/* NAME */}

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc={User}
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="room"
            label="Room"
            placeholder="Room 201"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
            iconSrc={email}
            iconAlt="email"
          />
        </div>

        {/* EMAIL & PHONE */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
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
        </div>

        {/* BirthDate & Gender */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
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

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Address"
          placeholder="14 street, New york, NY - 5101"
        />

        {/* Status & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="patientStatus"
            label="Status"
            placeholder="Select Patient Status"
          >
            {PatientStatusOption.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                <p className=" capitalize text-white">{type}</p>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder=" Software Engineer"
          />
        </div>

        {/* <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="occupationHistory"
          label="Occupation History"
          placeholder="Enter Patient Occupation History"
        /> */}
      </section>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Relation Profile</h2>
        </div>

        {/* Emergency Contact Name & Emergency Contact Number */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="nextOfKinName"
            label="Name of Next of KIN"
            placeholder="Next of KIN's name"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="nextOfKinNumber"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="relativeMaritialStatus"
            label="Maritial Status"
            renderSkeleton={(field) => (
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
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="nextOfKinAddress"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="nextOfKinOfficeAddress"
            label="Office Address"
            placeholder="14 street, New york, NY - 5101"
          />
        </div>

        {/* Relationship & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="nextOfKinRelationship"
            label="Relationship"
            placeholder="Parent?"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="nextOfKinOccupation"
            label="Occupation"
            placeholder=" Software Engineer"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification and Verfication</h2>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                <p className="text-white capitalize">{type}</p>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
      </section>

      <section className="space-y-6">
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary care professional"
          placeholder="Select a physician"
        >
          {staffs.map((doctor, i) => (
            <SelectItem
              key={doctor?.firstName + i}
              value={`${doctor?.firstName} ${doctor?.lastName}`}
            >
              <div className="flex cursor-pointer items-center gap-2">
                <img
                  src={doctor?.staffImage[0] || DrCruz}
                  width={32}
                  height={32}
                  alt="doctor"
                  className="rounded-full border border-dark-500"
                />
                <p className="text-white capitalize">{`${doctor?.firstName} ${doctor?.lastName}`}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="Patient consent to receive rehabilitation for their health condition."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="Patient consent to the use and disclosure of my health
            information for their rehabilitation purposes."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="Patient acknowledge that have reviewed and agree to the
            privacy policy"
        />
      </section>
    </div>
  );
};

export default BasicInformations;
