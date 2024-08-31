/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { PatientFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { redirect } from "react-router-dom";
import { BasicInformations, MedicalInformations } from "@/components/dashboard";
import SubmitButton from "@/components/common/SubmitButton";
import { fetchFirestoreData } from "@/utils/firebase/fetchFirestoreData";

const PatientProfile = ({ params: { userId } }: SearchParamProps) => {
  const [patient, setPatient] = useState<any>(null);
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
  });

  useEffect(() => {
    const getPatientDoc = async () => {
      try {
        const res = await fetchFirestoreData("patients", userId);
        setPatient(res);

        form.reset({
          ...res,
          birthDate: res?.birthDate?.toDate(),
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      getPatientDoc();
    }
  }, [userId, form]);

  console.log(patient);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const patientPayload = {
        ...values,
        birthDate: new Date(values.birthDate) || "",
        userId: patient?.userId,
      };

      const docRef = doc(db, "patients", patient?.userId);
      await updateDoc(docRef, patientPayload);

      if (step === 1) {
        setStep(2);
      } else {
        redirect(`/success/${patientPayload.name}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col space-y-14">
        <main>
          <section className="w-full space-y-4 mb-8">
            <h1 className="header capitalize">{patient?.name} Profile</h1>
          </section>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-12"
          >
            <section className="space-y-4">
              <h1 className="sub-header">
                {step === 1 ? "Basic Informations" : "Medical Informations 🩺"}
              </h1>
              <p className="text-dark-700">
                {editProfile && "Edit"} {step === 1 ? "Patient" : "Medical"}{" "}
                Informations.
              </p>
            </section>

            {step === 1 ? (
              <BasicInformations form={form} editProfile={editProfile} />
            ) : (
              <MedicalInformations form={form} editProfile={editProfile} />
            )}

            {editProfile ? (
              <SubmitButton isLoading={isLoading}>
                {step === 1 ? "Continue" : "Submit"}
              </SubmitButton>
            ) : (
              <Button
                onClick={() => setEditProfile(!editProfile)}
                className="bg-green-600"
              >
                Edit Profile
              </Button>
            )}

            <div className="mt-5 flex justify-start ">
              {step === 2 ? (
                <Button
                  className="flex items-center gap-2 px-0"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft /> Go Back
                </Button>
              ) : (
                <Button
                  className="flex bg-blue-700 items-center gap-2 "
                  onClick={() => setStep(2)}
                >
                  Next Page
                  <ArrowRight />
                </Button>
              )}
            </div>
          </form>
        </main>
      </div>
    </Form>
  );
};

export default PatientProfile;
