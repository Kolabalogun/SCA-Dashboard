"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { PatientFormDefaultValues } from "@/constants";
import { PatientFormValidation } from "@/lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import BasicInformations from "../PatientsRegistration/BasicInformations";
import MedicalInfomations from "../PatientsRegistration/MedicalInfomations";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

import PaymentInformations from "../PatientsRegistration/PaymentInformations";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(3);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    console.log(values);

    console.log(isLoading);

    setIsLoading(true);

    // Store file info in form data as
    let formData;
    // if (
    //   values.identificationDocument &&
    //   values.identificationDocument?.length > 0
    // ) {
    //   const blobFile = new Blob([values.identificationDocument[0]], {
    //     type: values.identificationDocument[0].type,
    //   });

    //   formData = new FormData();
    //   formData.append("blobFile", blobFile);
    //   formData.append("fileName", values.identificationDocument[0].name);
    // }

    try {
      const patient = {
        userId: user.id,
        name: values.name || "",
        email: values.email || "",
        phone: values.phone || "",

        diagnosis: values.diagnosis || "",
        primaryEducation: values.primaryEducation || "",
        secondaryEducation: values.secondaryEducation || "",
        tertiaryEducation: values.tertiaryEducation || "",
        vocationalEducation: values.vocationalEducation || "",

        birthDate: new Date(values.birthDate) || "",
        gender: values.gender || "",
        maritialStatus: values.maritialStatus || "",
        address: values.address || "",
        occupation: values.occupation || "",
        nextOfKinName: values.nextOfKinName || "",
        nextOfKinNumber: values.nextOfKinNumber || "",
        primaryPhysician: values.primaryPhysician || "",
        occupationHistory: values.occupationHistory || "",
        typeofDruguse: values.typeofDruguse || "",
        otherDrugs: values.otherDrugs || "",

        quantityDrugsConsumedDaily: values.quantityDrugsConsumedDaily || "",
        financilaImplicationsOfDrugAbuse:
          values.financilaImplicationsOfDrugAbuse || "",
        factorsThatLedToTheAbuse: values.factorsThatLedToTheAbuse || "",
        primaryDoctor: values.primaryDoctor || "",
        familyMembersComplains: values.familyMembersComplains || "",
        socialWorkerFindings: values.socialWorkerFindings || "",
        patientNeeds: values.patientNeeds || "",
        newMedication: values.newMedication || "",

        patientsMembersComplains: values.patientsMembersComplains || "",
        rehabilitationRecommendation: values.rehabilitationRecommendation || "",

        nextOfKinOccupation: values.nextOfKinOccupation || "",
        nextOfKinAddress: values.nextOfKinAddress || "",
        nextOfKinRelationship: values.nextOfKinRelationship || "",
        relativeMaritialStatus: values.relativeMaritialStatus || "",

        allergies: values.allergies || "",
        currentMedication: values.currentMedication || "",
        familyMedicalHistory: values.familyMedicalHistory || "",
        pastMedicalHistory: values.pastMedicalHistory || "",
        identificationType: values.identificationType || "",
        identificationNumber: values.identificationNumber || "",
        // identificationDocument: values.identificationDocument ? formData : null || '',
        privacyConsent: values.privacyConsent || "",
      };

      // Create a reference to the document
      const docRef = doc(db, "patients", user.id);

      // Update the document
      await updateDoc(docRef, patient);

      if (step === 1) {
        setStep(2);
        setIsLoading(false);
      } else if (step === 2) {
        setStep(3);
        setIsLoading(false);
      } else {
        router.replace(`/success/${patient.name}`);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {step === 2 && (
        <div className="mb-5 flex justify-start ">
          <Button
            className="flex items-center gap-2 px-0"
            onClick={() => setStep(1)}
          >
            <ArrowLeft /> Go Back
          </Button>
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">
            {step === 1
              ? "Welcome 👋"
              : step === 2
              ? "Medications 🩺"
              : "Payment 📇"}
          </h1>
          <p className="text-dark-700">
            Enter {step === 1 ? "Patient" : step === 2 ? "Medical" : "Payment"}{" "}
            Informations.
          </p>
        </section>

        {step === 1 ? (
          <BasicInformations form={form} editProfile={true} />
        ) : step === 2 ? (
          <MedicalInfomations form={form} editProfile={true} />
        ) : (
          <PaymentInformations form={form} editProfile={true} />
        )}

        {step === 3 && (
          <div className="mb-5 flex justify-start ">
            <Button
              className="flex bg-green-700 items-center gap-2 px-0"
              type="submit"
            >
              Skip
            </Button>
          </div>
        )}

        <SubmitButton isLoading={isLoading}>
          {step !== 3 ? "Continue" : "Submit"}
        </SubmitButton>
      </form>

      {step === 2 && (
        <div className="mt-5 flex justify-start ">
          <Button
            className="flex items-center gap-2 px-0"
            onClick={() => setStep(1)}
          >
            <ArrowLeft /> Go Back
          </Button>
        </div>
      )}
    </Form>
  );
};

export default RegisterForm;
