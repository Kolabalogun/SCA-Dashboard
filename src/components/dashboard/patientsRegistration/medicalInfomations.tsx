/* eslint-disable @typescript-eslint/no-explicit-any */
import { DrCruz } from "@/assets/images";
import CustomFormField from "@/components/common/CustomFormField";

import { SelectItem } from "@/components/ui/select";

import { FormFieldType } from "@/types/types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
  staffs: any[];
};

const MedicalInfomations = ({ form, staffs }: Props) => {
  return (
    <div className="space-y-9">
      {/* PRIMARY DOCTOR */}
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryDoctor"
        label="Consultant Psychiatrist"
        placeholder="Select a Psychiatrist"
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

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Complaints</h2>
        </div>

        {/* FAMILY MEDICATION & PAST MEDICATIONS */}

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="familyMembersComplains"
          label="Complaint from the family/parent"
          placeholder="Describe any concerns or complaints expressed by the family or parent regarding the individual's behavior, health, or well-being."
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="patientsComplains"
          label="Complaint from the patient (if any)"
          placeholder="Mention any complaints or concerns raised by the patient regarding their health, treatment, or well-being (if applicable)"
        />
      </section>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">History</h2>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family History"
            placeholder="Provide details of any relevant family medical history, including genetic conditions, chronic illnesses, or other health concerns"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="psychosocialHistory"
            label="Psychosocial History"
            placeholder="Provide relevant details about the individual's social, emotional, and psychological background, including family relationships, social interactions, and any relevant personal history"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="psychosexualHistory"
            label="Psychosexual History"
            placeholder="Describe the individual's sexual development, experiences, orientation, and any relevant concerns or issues related to sexual behavior or identity"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="pastMedicalHistory"
          label="Past Medical History"
          placeholder="List any past medical conditions, surgeries, or hospitalizations, including dates and treatments received."
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="educationHistory"
            label="Education History"
            placeholder="Provide details of the patient's educational background, including the highest level completed and any difficulties encountered."
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="vocationalHistory"
            label="Vocational History"
            placeholder="Describe the patient's work history, job roles, and any work-related challenges or achievements."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="forensic"
            label="Forensic"
            placeholder="Detail any involvement with the legal system, including arrests, charges, or court cases, if applicable."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="List any known allergies (e.g., food, medication, environmental) or indicate 'none' if there are none."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="drugUseHistory"
            label="Drug Use History"
            placeholder="Provide details about past and current drug use, including types of drugs and frequency of use, or indicate 'none' if applicable."
          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        {/* <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="patientNeeds"
            label="Patient Needs"
            placeholder="Luggage Pickups..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medications"
            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div> */}
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Differential Diagnosis</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="patientsComplains"
          label="Psychiatrist Only"
          placeholder="Enter the differential diagnosis as assessed by the psychiatrist"
        />
      </section>
    </div>
  );
};

export default MedicalInfomations;
