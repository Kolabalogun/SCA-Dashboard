/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { StaffFormValidation } from "@/lib/validation";
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
import { createAppUserConfig, db } from "@/config/firebase";
import { ArrowLeft, Trash2Icon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitButton from "@/components/common/SubmitButton";
import { StaffFormDefaultValues } from "@/constants";
import { useSelector } from "react-redux";
import { fetchFirestoreData, uploadFileToStorage } from "@/lib/firebase";
import { useToast } from "@chakra-ui/react";
import showToast from "@/components/common/toast";
import BasicInformations from "@/components/dashboard/staffsRegistration/basicInformations";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { deleteApp, initializeApp } from "firebase/app";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Loader from "@/components/common/Loader";
import { useAppContext } from "@/contexts/AppContext";
import { sendEmail } from "@/services/email";
import { AccessRole } from "@/types/types";

const StaffProfile = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { adminData, getAdminContent, adminEmails, fetchStaffs } =
    useAppContext();
  const { user } = useSelector((state: any) => state.auth);
  const { id: userId } = useParams();
  const [Staff, setStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [deleteLoader, setIsDeleteLoading] = useState<boolean>(false);
  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);

  const [step, setStep] = useState(1);

  useEffect(() => {
    scrollToTop();
    const awaitFetchStaff = async () => {
      setIsFetchLoading(true);
      try {
        await fetchStaffs();
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetchLoading(false);
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

  const form = useForm<z.infer<typeof StaffFormValidation>>({
    resolver: zodResolver(StaffFormValidation),
    defaultValues: StaffFormDefaultValues,
  });

  useEffect(() => {
    const getStaffDoc = async () => {
      setIsFetchLoading(true);
      try {
        const res = await fetchFirestoreData<any>("staffs", userId);

        if (res) {
          // Destructure the necessary fields and keep 'others' as a const
          const {
            createdAt: createdAtTimestamp,
            updatedAt: updatedAtTimestamp,

            birthDate: birthDateTimestamp,
            logs: logsTimestamp,
            ...others
          } = res;

          // Convert Firestore _Timestamps to JavaScript Dates

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
          const StaffData = {
            birthDate,
            updatedAt,
            createdAt,
            logs, // Include converted logs
            ...others,
          };

          setStaff(StaffData);

          form.reset(StaffData);
        } else {
          console.log("No Staff document found");
        }
      } catch (error) {
        console.log("Error fetching Staff document:", error);
      } finally {
        setIsFetchLoading(false);
      }
    };

    if (userId) {
      getStaffDoc();
    }
  }, [userId, form]);

  const { accessRole } = form.getValues();

  if (accessRole === "No Access") {
    form.setValue("password", "SCAUser@123");
    form.setValue("confirmPassword", "SCAUser@123");
  }

  const onSubmit = async (values: z.infer<typeof StaffFormValidation>) => {
    setIsLoading(true);
    const { email, staffImage, firstName, lastName, occupation, password } =
      values;

    const activitesRef = doc(db, "activites", `activity-${Date.now()}`);

    try {
      if (user?.accessRole === "user")
        return showToast(
          toast,
          "Access Denied",
          "warning",
          "You don't have access to edit this staff's profile"
        );

      if (userId) {
        // This block is for editing Staff info
        const StaffPayload = {
          ...values,
          email: email.toLowerCase(),
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          occupation: occupation.toLowerCase(),
        };
        if (typeof staffImage !== "string") {
          let fileUrl = "";

          if (staffImage && staffImage.length > 0) {
            // Upload the first file to Firebase Storage and get its URL
            fileUrl = await uploadFileToStorage(
              "staffs",
              staffImage[0],
              `${firstName}-${lastName}`
            );
          }

          // Add the file URL to the staff payload
          StaffPayload.staffImage = [fileUrl as any];
        }

        const docRef = doc(db, "staffs", userId);
        await updateDoc(docRef, StaffPayload);

        const data = {
          title: "Staff Profile Update",
          activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
          activtyCarriedOutEmailBy: `${user?.email}`,
          createdAt: serverTimestamp(),
          formDate: new Date().toISOString(),
          type: "Profile Update",
          desc: `Staff Profile Update for ${firstName} ${lastName}. Staff Role is set to ${values?.accessRole}`,
        };

        await setDoc(activitesRef, data);

        try {
          // const emailData = {
          //   emails: [user?.email],
          //   subject: `Staff Profile Update for ${user?.firstName} ${user?.lastName} `,
          //   message: `You carried out Staff Profile Update for ${user?.firstName} ${user?.lastName}  `,
          // };

          const adminEmailData = {
            emails: adminEmails,
            subject: `New Staff Profile Update for ${user?.firstName} ${user?.lastName} `,
            message: `Staff Profile Update for ${firstName} ${lastName} performed by ${user?.firstName} ${user?.lastName}. Staff Role is set to ${values?.accessRole}`,
          };

          // const message = await sendEmail(emailData);
          const adminMessage = await sendEmail(adminEmailData);
          //  console.log("Email sent successfully:", message);
          console.log("Admin Email sent successfully:", adminMessage);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          showToast(toast, "Email Error", "warning", "Email failed to send.");
        }

        showToast(
          toast,
          "Staffs",
          "success",
          "Staff Data successfully updated"
        );

        setIsEditStaffModalOpen(false);
      } else {
        let fileUrl = "";

        if (staffImage && staffImage.length > 0) {
          // Upload the first file to Firebase Storage and get its URL
          fileUrl = await uploadFileToStorage(
            "staffs",
            staffImage[0],
            `${firstName}-${lastName}`
          );
        }

        if (step === 1) {
          // Check if a document with the same email already exists
          const q = query(
            collection(db, "staffs"),
            where("email", "==", email.toLowerCase())
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            form.setError(
              "email",
              {
                type: "manual",
                message: "A Staff with this email already exists.",
              },
              {
                shouldFocus: true,
              }
            );
            setIsLoading(false);
            return;
          }

          // Register the staff without signing them in

          try {
            if (values.accessRole !== "No Access") {
              const createApp = initializeApp(
                createAppUserConfig,
                `"createAppUser-"${values.firstName}-${values.lastName}`
              );
              const createAuth = getAuth(createApp);

              await createUserWithEmailAndPassword(
                createAuth,
                values.email.toLowerCase(),
                values.password
              );

              // Dispose of the separate app instance
              await deleteApp(createApp);
            }
          } catch (error) {
            console.error("Error registering staff:", error);
          }

          const Staff = {
            ...values,
            email: email.toLowerCase(),
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            occupation: occupation.toLowerCase(),
            registeredBy: `${user?.firstName} ${user?.lastName}`,
            createdAt: serverTimestamp(),
            staffImage: fileUrl ? [fileUrl] : "",
            logs: [],
          };

          await addDoc(collection(db, "staffs"), Staff);

          // Update Admin Doc

          const adminRef = doc(db, "admin", "adminDoc");

          const newStaffNo = parseInt(adminData?.totalStaffs) + 1;

          await updateDoc(adminRef, {
            totalStaffs: newStaffNo,
          });

          //  Update Activities

          const data = {
            title: "Staff Registration",
            activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
            activtyCarriedOutEmailBy: `${user?.email}`,
            createdAt: serverTimestamp(),
            formDate: new Date().toISOString(),
            type: "Staff Registration",
            desc: `Staff Registration for ${firstName} ${lastName}. Staff Role is set to ${values?.accessRole}`,
          };

          await setDoc(activitesRef, data);

          // Email sending in a separate try-catch block to handle its own errors
          try {
            // const emailData = {
            //   emails: [user?.email],
            //   subject: `Staff Registration for ${user?.firstName} ${user?.lastName} `,
            //   message: `You carried out Staff registration for ${user?.firstName} ${user?.lastName}  `,
            // };

            const newStaffEmailData = {
              emails: [email],
              subject: `Account Registration`,
              message: `Your profile has been registered at Shayofunmi Care Agency. You've been given  an access role of ${accessRole}. Your password is ${password} `,
            };

            const adminEmailData = {
              emails: adminEmails,
              subject: `New Staff Registration for ${user?.firstName} ${user?.lastName} `,
              message: `Staff Registration for ${firstName} ${lastName} performed by ${user?.firstName} ${user?.lastName}. Staff Role is set to ${values?.accessRole}`,
            };

            // const message = await sendEmail(emailData);
            const staffMessage = await sendEmail(newStaffEmailData);
            const adminMessage = await sendEmail(adminEmailData);

            //  console.log("Email sent successfully:", message);
            console.log("Email sent successfully:", staffMessage);
            console.log("Admin Email sent successfully:", adminMessage);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            showToast(toast, "Email Error", "warning", "Email failed to send.");
          }

          showToast(
            toast,
            "Registration",
            "success",
            "Staff successfully Registered"
          );

          getAdminContent();
          navigate("/dashboard/staffs");
          setIsLoading(false);
        }
      }
      fetchStaffs();
    } catch (error) {
      console.log(error);
      showToast(toast, "Registration", "error", "Error registering Staff ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async () => {
    setIsDeleteLoading(true);
    try {
      if (userId) {
        const docRef = doc(db, "staffs", userId);
        await deleteDoc(docRef);

        // Update Admin Doc

        const adminRef = doc(db, "admin", "adminDoc");

        const newStaffNo = parseInt(adminData?.totalStaffs) - 1;

        await updateDoc(adminRef, {
          totalStaffs: newStaffNo,
        });
        getAdminContent();

        setIsDeleteStaffModalOpen(false);
        showToast(toast, "SCA", "warning", "Staff deleted successfully");
        navigate("/dashboard/staffs");
      }
    } catch (error) {
      console.log(error);
      showToast(toast, "SCA", "error", "Error deleting Staff profile");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  if (isFetchLoading) return <Loader />;

  return (
    <div className="container    flex flex-col  ">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isDeleteStaffModalOpen}
        onConfirm={handleDeleteStaff}
        onCancel={() => setIsDeleteStaffModalOpen(false)}
        isLoading={deleteLoader}
        title="Confirm Action"
        message="Are you sure you want to delete this staff's profile? Please note that only staff records can be deleted, and once deleted, the staff member will no longer be able to sign up using this email."
      />

      <ConfirmationModal
        isOpen={isEditStaffModalOpen}
        onConfirm={form.handleSubmit(onSubmit)}
        onCancel={() => setIsEditStaffModalOpen(false)}
        isLoading={isLoading}
        title="Confirm Action"
        message="Are you sure you want to edit this staff's Profile?"
      />
      <Form {...form}>
        <div className="flex flex-col mb-10  space-y-14">
          <main>
            <section className="w-full space-y-4 mb-8">
              <h1 className="header capitalize ">
                {userId ? `${Staff?.firstName}'s Profile` : "Hi there 👋"}
              </h1>

              <p className="text-dark-700">
                {userId
                  ? `Edit ${Staff?.firstName} Profile: ID: ${userId} `
                  : "Get started with Staff's Registration."}
              </p>
            </section>

            <form
              onSubmit={
                userId
                  ? (e: any) => {
                      e.preventDefault();

                      setIsEditStaffModalOpen(true);
                    }
                  : form.handleSubmit(onSubmit)
              }
              className="flex-1 space-y-12"
            >
              <BasicInformations userId={userId} form={form} />

              {step !== 4 && user?.accessRole !== AccessRole.Viewer && (
                <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
              )}
            </form>

            {userId && user?.accessRole === AccessRole.Admin && (
              <div className="my-8">
                <Button
                  type="button"
                  className="bg-red-800 gap-2"
                  onClick={() => setIsDeleteStaffModalOpen(true)}
                >
                  Delete Staff's Profile <Trash2Icon className="h-5" />
                </Button>
              </div>
            )}

            <div className="mt-8 flex gap-5 justify-between   ">
              {step !== 1 && (
                <Button
                  className="flex items-center gap-2 px-0"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft /> Go Back
                </Button>
              )}
            </div>
          </main>
        </div>
      </Form>
    </div>
  );
};

export default StaffProfile;
