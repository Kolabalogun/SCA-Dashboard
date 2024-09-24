/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomFormField from "@/components/common/CustomFormField";

import { FormFieldType } from "@/types/types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

const MedicalInfomations2 = ({ form }: Props) => {
  return (
    <div className="space-y-9">
      <section className="space-y-6">
        <div className="mb-9 space-y-2">
          <h2 className="sub-header">Plan</h2>
          <p className="text-white font-medium text-sm">
            Biopsychosocial Approach
          </p>
        </div>
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="biologicalApproach"
          label="Biological Approach"
          placeholder="Describe the biological aspects of the biopsychosocial approach"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="socialApproach"
            label="Social Approach"
            placeholder="Describe the social aspects of the biopsychosocial approach"
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="psychologicalApproach"
          label="Psychological Approach"
          placeholder="Describe the psychological aspects of the biopsychosocial approach"
        />
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Other Assessment</h2>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="recoveryCapital"
            label="Recovery Capital"
            placeholder="Describe the personal, social, and community resources available for recovery"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="swotAnalysis"
            label="Swot Analysis"
            placeholder="Identify strengths, weaknesses, opportunities, and threats relevant to the patient recovery."
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="riskAssesstion"
            label="Risk Assession"
            placeholder="Evaluate potential risks and safety concerns for the patient"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="needsAssessment"
            label="Needs Assessment"
            placeholder="Identify the patient's needs and required support for care and recovery."
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="goalsandPriorities"
          label="Goals and Priorities"
          placeholder="Outline the patient's short-term and long-term goals and their primary priorities for treatment"
        />
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Profiles</h2>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="socialProflies"
            label="Social Proflies Identified "
            placeholder="List any relevant social profiles or networks associated with the patient."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="biologicalProflies"
            label="Biological Proflies Identified "
            placeholder="List any relevant biological profiles or networks associated with the patient."
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="psychologicalProflies"
            label="Psychological Proflies Identified "
            placeholder="List any relevant psychological profiles or networks associated with the patient."
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="rehabilitationRecommendation"
          label="Rehabilitation Plan"
          placeholder="Outline the patient's rehabilitation plan, including key interventions and strategies."
        />
      </section>
    </div>
  );
};

export default MedicalInfomations2;
