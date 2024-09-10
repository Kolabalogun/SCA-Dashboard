/* eslint-disable react-hooks/exhaustive-deps */
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
  Timestamp,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { ArrowLeft, ArrowRight, ListIcon, Trash2Icon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import LogsInformations from "@/components/dashboard/patientsRegistration/logsInformations";
import { AccessRole } from "@/types/types";
import Loader from "@/components/common/Loader";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useAppContext } from "@/contexts/AppContext";
import { sendEmail } from "@/services/email";

const PatientProfile = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { id: userId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [patient, setPatient] = useState<any>(null);
  const [patientDocId, setPatientDocId] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const {
    adminData,
    getAdminContent,
    professionalCareOfficers,
    adminEmails,
    fetchStaffs,
  } = useAppContext();
  const [deleteLoader, setIsDeleteLoading] = useState<boolean>(false);
  const [isDeletePatientModalOpen, setIsDeletePatientModalOpen] =
    useState(false);

  useEffect(() => {
    scrollToTop();

    const awaitFetchStaff = async () => {
      setLoading(true);
      try {
        await fetchStaffs();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    awaitFetchStaff();
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
      setLoading(true);
      try {
        const res = await fetchFirestoreData<any>("patients", userId);

        if (res) {
          // Destructure the necessary fields and keep 'others' as a const
          const {
            createdAt: createdAtTimestamp,
            updatedAt: updatedAtTimestamp,
            dateOfAdmission: dateOfAdmissionTimestamp,
            birthDate: birthDateTimestamp,
            logs: logsTimestamp,
            ...others
          } = res;

          // Convert Firestore _Timestamps to JavaScript Dates
          const dateOfAdmission =
            dateOfAdmissionTimestamp instanceof Timestamp
              ? dateOfAdmissionTimestamp.toDate()
              : dateOfAdmissionTimestamp;
          const birthDate =
            birthDateTimestamp instanceof Timestamp
              ? birthDateTimestamp.toDate()
              : birthDateTimestamp;
          const createdAt =
            createdAtTimestamp instanceof Timestamp
              ? createdAtTimestamp.toDate()
              : createdAtTimestamp;
          const updatedAt =
            updatedAtTimestamp instanceof Timestamp
              ? updatedAtTimestamp.toDate()
              : updatedAtTimestamp;

          // Convert timestamps inside logs if logs are an array
          const logs = Array.isArray(logsTimestamp)
            ? logsTimestamp.map((log: any) => ({
                ...log,
                updatedAt:
                  log.updatedAt instanceof Timestamp
                    ? log.updatedAt.toDate()
                    : log.updatedAt, // Convert updatedAt timestamp to Date
              }))
            : logsTimestamp;

          // Use 'const' for 'others' since it's not reassigned
          const patientData = {
            dateOfAdmission,
            birthDate,
            updatedAt,
            createdAt,
            logs, // Include converted logs
            ...others,
          };

          setPatient(patientData);

          form.reset(patientData);
        } else {
          console.log("No patient document found");
        }
      } catch (error) {
        console.log("Error fetching patient document:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getPatientDoc();
    }
  }, [userId, form]);

  const { logs } = form.getValues();

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    const { email, identificationDocument, name } = values;

    const activitesRef = doc(db, "activites", `activity-${Date.now()}`);

    try {
      if (user?.role === AccessRole.Viewer)
        return showToast(
          toast,
          "Access Denied",
          "warning",
          "You don't have access to edit this patient profile"
        );

      if (userId) {
        // This block is for editing patient info
        const patientPayload = {
          ...values,
        };

        const docRef = doc(db, "patients", userId);
        await updateDoc(docRef, patientPayload);

        //  Update Activities

        const data = {
          title: "Patient Profile Update",
          activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
          activtyCarriedOutEmailBy: `${user?.email}`,
          createdAt: serverTimestamp(),
          formDate: new Date().toISOString(),
          type: "Profile Update",
          desc: `Patient Profile Update for ${name}  `,
        };

        await setDoc(activitesRef, data);

        const emailData = {
          emails: [user?.email],
          subject: `Patient Profile Update for ${name} `,
          message: `You carried out Patient Profile Update for ${name}  `,
        };

        const adminEmailData = {
          emails: adminEmails,
          subject: `New Patient Profile Update for ${name} `,
          message: `Patient Profile Update for ${name} performed by ${user?.firstName} ${user?.lastName}`,
        };

        const message = await sendEmail(emailData);
        const adminMessage = await sendEmail(adminEmailData);
        console.log("Email sent successfully:", message);
        console.log("Admin Email sent successfully:", adminMessage);

        setIsModalOpen(false);
        showToast(
          toast,
          "Patient",
          "success",
          "Patient Data successfully updated"
        );
      } else {
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

          // Update Admin Doc

          const adminRef = doc(db, "admin", "adminDoc");

          const newPatientsNo = parseInt(adminData?.totalPatients) + 1;

          await updateDoc(adminRef, {
            totalPatients: newPatientsNo,
          });

          //  Update Activities

          const data = {
            title: "Patient Registration",
            activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
            activtyCarriedOutEmailBy: `${user?.email}`,
            createdAt: serverTimestamp(),
            formDate: new Date().toISOString(),
            type: "Patient Admission",

            desc: `Patient Registration for ${name} performed by ${user?.firstName} ${user?.lastName}`,
          };

          await setDoc(activitesRef, data);

          const emailData = {
            emails: [user?.email],
            subject: `Patient Registration for ${name} `,
            message: `You carried out Patient registration for ${name}  `,
          };

          const adminEmailData = {
            emails: adminEmails,
            subject: `New Patient Registration for ${name} `,
            message: `Patient Registration for ${name} performed by ${user?.firstName} ${user?.lastName}`,
          };

          const message = await sendEmail(emailData);
          const adminMessage = await sendEmail(adminEmailData);
          console.log("Email sent successfully:", message);
          console.log("Admin Email sent successfully:", adminMessage);

          showToast(
            toast,
            "Registration",
            "success",
            "Patient successfully Registered"
          );
          getAdminContent();
          setIsModalOpen(false);
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

  const handleDeletePatient = async () => {
    setIsDeleteLoading(true);
    try {
      if (userId) {
        const docRef = doc(db, "patients", userId);
        await deleteDoc(docRef);

        // Update Admin Doc

        const adminRef = doc(db, "admin", "adminDoc");

        const newPatientNo = parseInt(adminData?.totalPatients) - 1;

        await updateDoc(adminRef, {
          totalPatients: newPatientNo,
        });
        getAdminContent();

        setIsDeletePatientModalOpen(false);
        showToast(toast, "SCA", "warning", "Patient deleted successfully");
        navigate("/dashboard/patients");
      }
    } catch (error) {
      console.log(error);
      showToast(toast, "SCA", "error", "Error deleting Patient profile");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container    flex flex-col  ">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={form.handleSubmit(onSubmit)}
        onCancel={() => setIsModalOpen(false)}
        title="Confirm Deletion"
        message={`Are you sure you want to ${
          userId ? "edit" : "register"
        } this patient?`}
        isLoading={isLoading}
      />

      {/* Delete  */}
      <ConfirmationModal
        isOpen={isDeletePatientModalOpen}
        onConfirm={handleDeletePatient}
        onCancel={() => setIsDeletePatientModalOpen(false)}
        isLoading={deleteLoader}
        title="Confirm Action"
        message="Are you sure you want to delete this Patient's Profile?"
      />

      <Form {...form}>
        <div className="flex flex-col mb-10  space-y-14">
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
              onSubmit={
                step === 1
                  ? (e: any) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                    }
                  : form.handleSubmit(onSubmit)
              }
              className="flex-1 space-y-12"
            >
              <section className="space-y-4">
                {userId ? (
                  <h1 className="sub-header">
                    {step === 1
                      ? "Basic Informations"
                      : step === 2 && "Medical Informations 🩺"}
                  </h1>
                ) : (
                  <h1 className="sub-header">
                    {step === 2 && "Medical Informations 🩺"}{" "}
                  </h1>
                )}
                {userId && step !== 4 && (
                  <p className="text-dark-700">
                    {userId && "Edit"}{" "}
                    {step === 1
                      ? "Patient"
                      : step === 2
                      ? "Medical"
                      : step === 3 && "Payment"}{" "}
                    Informations.
                  </p>
                )}
              </section>

              {step === 1 ? (
                <BasicInformations
                  staffs={professionalCareOfficers}
                  form={form}
                />
              ) : step === 2 ? (
                <MedicalInformations
                  staffs={professionalCareOfficers}
                  form={form}
                />
              ) : step === 4 && userId ? (
                <LogsInformations form={form} />
              ) : (
                <PaymentInformations form={form} patientDocId={patientDocId} />
              )}

              {step !== 4 && (
                <SubmitButton isLoading={isLoading}>
                  {userId ? "Submit" : step === 1 ? "Continue" : "Submit"}
                </SubmitButton>
              )}
            </form>

            <div className="mt-8 flex gap-5 justify-between   ">
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

              {step === 3 && userId && logs && logs?.length > 0 && (
                <Button
                  className="flex bg-blue-700 items-center gap-2 "
                  onClick={() => setStep(step + 1)}
                >
                  View Logs
                  <ListIcon size={18} />
                </Button>
              )}
            </div>

            {userId && (
              <div className="my-8">
                <Button
                  type="button"
                  className="bg-red-800 gap-2"
                  onClick={() => setIsDeletePatientModalOpen(true)}
                >
                  Delete Patient's Profile <Trash2Icon className="h-5" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </Form>
    </div>
  );
};

export default PatientProfile;
