import React, { useEffect } from "react";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FormControl } from "../ui/form";
import { DrugsOptions, Doctors } from "@/constants";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { UseFormReturn } from "react-hook-form";
import { SelectItem } from "../ui/select";

import Image from "next/image";

type Props = {
  form: UseFormReturn<any>;
  editProfile: boolean;
};

const MedicalInfomations = ({ form, editProfile }: Props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="space-y-9">
      {/* PRIMARY DOCTOR */}
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryDoctor"
        label="Consultant Psychiatrist"
        placeholder="Select a Psychiatrist"
        readOnly={!editProfile}
      >
        {Doctors.map((doctor, i) => (
          <SelectItem key={doctor.name + i} value={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={doctor.image}
                width={32}
                height={32}
                alt="doctor"
                className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Patient History</h2>
        </div>

        {/* FAMILY MEDICATION & PAST MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="familyMedicalHistory"
            label="Patient's history"
            placeholder="Mother had brain cancer, Father has hypertension"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="familyMembersComplains"
            label="Complaints From The Relation"
            placeholder="Strange acting.."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="patientsMembersComplains"
            label="Complaints From The Patient"
            placeholder="Strange acting..."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="socialWorkerFindings"
            label="Social Worker Findings"
            placeholder="Apperance, Mood, Judgement"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="patientNeeds"
            label="Patient Needs"
            placeholder="Luggage Pickups..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="currentMedication"
            label="Current medications"
            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>
      </section>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">History Of Drug Abuse</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="typeofDruguse"
          label="Type of Drug use"
          renderSkeleton={(field) => (
            <FormControl>
              <RadioGroup
                className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={!editProfile}
              >
                {DrugsOptions.map((option, i) => (
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
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            readOnly={!editProfile}
            control={form.control}
            name="otherDrugs"
            label="Other Drugs (Specify if any)"
            placeholder="Weed"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            readOnly={!editProfile}
            control={form.control}
            name="quantityDrugsConsumedDaily"
            label="Quantity Consummed daily"
            placeholder="2"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="financilaImplicationsOfDrugAbuse "
            label="Financial Implications on Drug Consummed"
            placeholder="N500 per Day"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            readOnly={!editProfile}
            control={form.control}
            name="factorsThatLedToTheAbuse"
            label="Factors that led to the Abuse"
            placeholder=""
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Psychiatrist Comment</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          readOnly={!editProfile}
          control={form.control}
          name="diagnosis"
          label="Diagnosis"
          placeholder="Headache, Stomach aches, etc..."
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          readOnly={!editProfile}
          control={form.control}
          name="newMedication"
          label="New Medications"
          placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          readOnly={!editProfile}
          control={form.control}
          name="rehabilitationRecommendation"
          label="Rehabilitation & Recommendation"
          placeholder=""
        />
      </section>
    </div>
  );
};

export default MedicalInfomations;
