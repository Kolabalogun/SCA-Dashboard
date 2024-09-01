/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { PatientFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import {
  BasicInformations,
  MedicalInformations,
  PaymentInformations,
} from "@/components/dashboard";
import SubmitButton from "@/components/common/SubmitButton";

import { PatientFormDefaultValues } from "@/constants";
import { useSelector } from "react-redux";
import { fetchFirestoreData, uploadFileToStorage } from "@/lib/firebase";
import { useToast } from "@chakra-ui/react";
import showToast from "@/components/common/toast";

const PatientProfile = () => {
  const toast = useToast();

  const navigate = useNavigate();

  const { user } = useSelector((state: any) => state.auth);
  const { id: userId } = useParams();

  const [patient, setPatient] = useState<any>(null);

  const [patientDocId, setPatientDocId] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    scrollToTop();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: PatientFormDefaultValues,
  });

  useEffect(() => {
    const getPatientDoc = async () => {
      try {
        const res = await fetchFirestoreData("patients", userId);

        console.log(res);

        const { createdAt, updatedAt, birthDate, ...others } = res;
        setPatient(others);

        form.reset({
          ...others,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      getPatientDoc();
    }
  }, [userId, form]);

  console.log(userId);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      if (userId) {
        // This block is for editing patient info
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
      } else {
        console.log(values);
        const { email, identificationDocument, name } = values;

        let fileUrl = "";

        if (identificationDocument && identificationDocument.length > 0) {
          // Upload the first file to Firebase Storage and get its URL
          fileUrl = await uploadFileToStorage(identificationDocument[0], name);
        }

        if (step === 1) {
          // Check if a document with the same email already exists
          const q = query(
            collection(db, "patients"),
            where("email", "==", email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            form.setError(
              "email",
              {
                type: "manual",
                message: "A patient with this email already exists.",
              },
              {
                shouldFocus: true,
              }
            );
            setIsLoading(false);
            return;
          }

          const patient = {
            ...values,
            registeredBy: `${user?.firstName} ${user?.lastName}`,
            createdAt: serverTimestamp(),
            identificationDocument: fileUrl ? fileUrl : "",
            logs: [],
          };

          const docRef = await addDoc(collection(db, "patients"), patient);

          setPatientDocId(docRef.id);

          console.log(docRef);

          showToast(
            toast,
            "Registration",
            "success",
            "Patient successfully Registered"
          );
          setStep(2);
          setIsLoading(false);
        } else if (step === 2) {
          // This block is for step 2 of patient registration

          const logs = [
            ...(values.logs || []),
            {
              updatedBy: `${user?.firstName} ${user?.lastName}`,
              updatedAt: new Date(Date.now()),
            },
          ];
          const patientPayload = {
            ...values,
            updatedAt: serverTimestamp(),
            logs,
          };

          if (patientDocId) {
            const docRef = doc(db, "patients", patientDocId);
            await updateDoc(docRef, patientPayload);

            showToast(
              toast,
              "Registration",
              "success",
              "Patient Data updated successfully"
            );
            setStep(3);
          } else {
            setStep(1);
          }

          setIsLoading(false);
        } else {
          const logs = [
            ...(values.logs || []),
            {
              updatedBy: `${user?.firstName} ${user?.lastName}`,
              updatedAt: new Date(Date.now()),
            },
          ];
          const patientPayload = {
            ...values,
            updatedAt: serverTimestamp(),
            logs,
          };

          if (patientDocId) {
            const docRef = doc(db, "patients", patientDocId);
            await updateDoc(docRef, patientPayload);

            showToast(
              toast,
              "Registration",
              "success",
              "Patient Data updated successfully"
            );
            showToast(
              toast,
              "Registration",
              "success",
              "Patient Data updated successfully"
            );
            navigate(`/dashboard/success/${values.name}`);
          } else {
            setStep(1);
          }

          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      showToast(toast, "Registration", "error", "Error updating patient data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container    flex flex-col  ">
      <Form {...form}>
        <div className="flex flex-col  space-y-14">
          <main>
            <section className="w-full space-y-4 mb-8">
              <h1 className="header ">
                {userId ? `${patient?.name} Profile` : "Hi there 👋"}
              </h1>
              {!userId && (
                <p className="text-dark-700">
                  Get started with Patient's Registration.
                </p>
              )}
            </section>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 space-y-12"
            >
              <section className="space-y-4">
                {userId ? (
                  <h1 className="sub-header">
                    {step === 1
                      ? "Basic Informations"
                      : "Medical Informations 🩺"}
                  </h1>
                ) : (
                  <h1 className="sub-header">
                    {step === 2 && "Medical Informations 🩺"}{" "}
                  </h1>
                )}
                {userId && (
                  <p className="text-dark-700">
                    {editProfile && "Edit"} {step === 1 ? "Patient" : "Medical"}{" "}
                    Informations.
                  </p>
                )}
              </section>

              {step === 1 ? (
                <BasicInformations form={form} editProfile={true} />
              ) : step === 2 ? (
                <MedicalInformations form={form} editProfile={true} />
              ) : (
                <PaymentInformations form={form} editProfile={true} />
              )}

              {editProfile || !userId ? (
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
            </form>

            <div className="mt-5 flex justify-start ">
              {step !== 1 && (
                <Button
                  className="flex items-center gap-2 px-0"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft /> Go Back
                </Button>
              )}
              {step < 3 && userId && (
                <Button
                  className="flex bg-blue-700 items-center gap-2 "
                  onClick={() => setStep(step + 1)}
                >
                  Next Page
                  <ArrowRight />
                </Button>
              )}
            </div>
          </main>
        </div>
      </Form>
    </div>
  );
};

export default PatientProfile;
