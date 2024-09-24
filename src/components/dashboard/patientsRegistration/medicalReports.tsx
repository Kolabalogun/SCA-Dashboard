/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { formatDate } from "@/utils/formatJSDate";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { AccessRole, FormFieldType } from "@/types/types";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { uploadFileToStorage } from "@/lib/firebase";
import { useToast } from "@chakra-ui/react";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useSelector } from "react-redux";
import showToast from "@/components/common/toast";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import TextEditor from "@/components/common/TextEditor";
import { FormControl } from "@/components/ui/form";
import { useAppContext } from "@/contexts/AppContext";
import { sendEmail } from "@/services/email";

type Props = {
  form: UseFormReturn<any>;
  patientDocId?: string;
};

const MedicalReports = ({ form, patientDocId }: Props) => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const {
    title,
    report,
    medicalReports,
    name,
    email,
    primaryPhysician,
    patientStatus,
  } = form.getValues();
  const { adminEmails } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoader, setIsDeleteLoading] = useState<boolean>(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isDeleteReportModalOpen, setIsDeleteReportModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any>(null);

  useWatch({
    control: form.control,
    name: "report",
  });
  useWatch({
    control: form.control,
    name: "reportFile",
  });
  useWatch({
    control: form.control,
    name: "reportDate",
  });
  useWatch({
    control: form.control,
    name: "title",
  });
  useWatch({
    control: form.control,
    name: "medicalReports",
  });

  const handleDescriptionChange = (data: string) => {
    form.setValue("report", data);
  };

  const handleAddReport = async (e: any) => {
    e.preventDefault();
    const { reportFile, ...others } = form.getValues();
    if (!title || !report) {
      return showToast(toast, "SCA", "error", "Please fill in all the fields");
    }
    setIsLoading(true);

    const activitesRef = doc(db, "activites", `activity-${Date.now()}`);
    try {
      const medicalReportsss = medicalReports || [];

      let reportFileUrl = "";

      if (reportFile && reportFile.length > 0) {
        // Upload the first file to Firebase Storage and get its URL
        reportFileUrl = await uploadFileToStorage(
          "medicalReports",
          reportFile[0],
          `${patientDocId}`
        );
      }

      const newReport = {
        report,
        title,
        reportFile: reportFileUrl,
        activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
        activtyCarriedOutEmailBy: `${user?.email}`,
        formDate: new Date().toISOString(),
        desc: `New Medical Report on ${name}`,
        reportRegisteredBy: `${user?.firstName} ${user?.lastName}`,
        type: "Profile Update",
        patientDocId,
      };

      const newMedicalReports = [...medicalReportsss, newReport];

      // For Profile Update
      if (patientDocId) {
        const patientPayload = {
          ...others,
          email: email.toLowerCase(),
          name: name.toLowerCase(),
          primaryPhysician: primaryPhysician.toLowerCase(),
          patientStatus: patientStatus.toLowerCase(),
          medicalReports: newMedicalReports,
        };

        const patientRef = doc(db, "patients", patientDocId);

        await updateDoc(patientRef, patientPayload);

        const actvityPayload = {
          ...newReport,
          createdAt: serverTimestamp(),
        };

        await setDoc(activitesRef, actvityPayload);

        try {
          // const emailData = {
          //   emails: [user?.email],
          //   subject: `New Medical Report titled ${title} `,
          //   message: `Medical Report, titled "${title}" is added by ${
          //     user?.firstName
          //   } ${
          //     user?.lastName
          //   }. This report is assigned to Patient ${name} on ${
          //     formatDate(new Date().toISOString()) || "N/A"
          //   }`,
          // };

          const adminEmailData = {
            emails: adminEmails,
            subject: `New Medical Report titled ${title} `,
            message: `Medical Report, titled "${title}" is added by ${
              user?.firstName
            } ${
              user?.lastName
            }. This report is assigned to Patient ${name} on ${
              formatDate(new Date().toISOString()) || "N/A"
            }`,
          };

          // // const message = await sendEmail(emailData);
          const adminMessage = await sendEmail(adminEmailData);
          ////  console.log("Email sent successfully:", message);
          console.log("Admin Email sent successfully:", adminMessage);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          showToast(
            toast,
            "Email Error",
            "warning",
            "Report added, but email failed to send."
          );
        }

        showToast(toast, "SCA", "success", "Report added successfully");

        form.setValue("medicalReports", newMedicalReports);
      }
    } catch (error) {
      console.log(error);
      showToast(toast, "SCA", "error", "Error adding report");
    } finally {
      form.setValue("report", "");
      form.setValue("title", "");
      form.setValue("reportFile", []);
      form.setValue("reportDate", new Date(Date.now()));
      setIsLoading(false);
      setIsAddReportModalOpen(false);
    }
  };

  const handleDeleteReport = async (e: any) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    console.log(reportToDelete);
    const activitesRef = doc(db, "activites", `activity-${Date.now()}`);
    try {
      const updatedReports = medicalReports.filter(
        (d: any) => d.formDate !== reportToDelete?.formDate
      );

      if (patientDocId) {
        const patientRef = doc(db, "patients", patientDocId);
        await updateDoc(patientRef, {
          medicalReports: updatedReports,
        });

        // Update Activity
        const dataa = {
          title: "Medical Report Deletion",
          activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
          activtyCarriedOutEmailBy: `${user?.email}`,
          createdAt: serverTimestamp(),
          formDate: new Date().toISOString(),
          type: "Deletion",
          desc: `Medical Report, titled "${
            reportToDelete.title
          }" was deleted by ${user?.firstName} ${
            user?.lastName
          }. Initially, this report was assigned to Patient ${name} on ${
            formatDate(reportToDelete?.formDate) || "N/A"
          }`,
        };

        await setDoc(activitesRef, dataa);

        try {
          // const emailData = {
          //   emails: [user?.email],
          //   subject: `You just deleted a Report titled ${reportToDelete.title} `,
          //   message: `Medical Report, titled "${
          //     reportToDelete.title
          //   }" was deleted by ${user?.firstName} ${
          //     user?.lastName
          //   }. Initially, this report was assigned to Patient ${name} on ${
          //     formatDate(reportToDelete?.formDate) || "N/A"
          //   }`,
          // };

          const adminEmailData = {
            emails: adminEmails,
            subject: `Deleted Medical Reports `,
            message: `Medical Report, titled "${
              reportToDelete.title
            }" was deleted by ${user?.firstName} ${
              user?.lastName
            }. Initially, this report was assigned to Patient ${name} on ${
              formatDate(reportToDelete?.formDate) || "N/A"
            }`,
          };

          // // const message = await sendEmail(emailData);
          const adminMessage = await sendEmail(adminEmailData);
          ////  console.log("Email sent successfully:", message);
          console.log("Admin Email sent successfully:", adminMessage);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          showToast(
            toast,
            "Email Error",
            "warning",
            "Report deleted, but email failed to send."
          );
        }

        form.setValue("medicalReports", updatedReports);
        showToast(toast, "SCA", "warning", "Report deleted successfully");
      }
    } catch (error) {
      console.log(error);
      showToast(toast, "Report", "error", "Error deleting Report");
    } finally {
      setIsDeleteLoading(false);

      setIsDeleteReportModalOpen(false);
    }
  };

  return (
    <div className="space-y-9">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isAddReportModalOpen}
        onConfirm={handleAddReport}
        onCancel={() => setIsAddReportModalOpen(false)}
        isLoading={isLoading}
        title="Confirm Action"
        message="Are you sure you want to add this report?"
      />

      {/* Delete Modal  */}
      <ConfirmationModal
        isOpen={isDeleteReportModalOpen}
        onConfirm={handleDeleteReport}
        onCancel={() => setIsDeleteReportModalOpen(false)}
        isLoading={deleteLoader}
        title="Delete Report"
        message="Are you sure you want to delete this Report?"
      />

      <section className="space-y-6">
        {medicalReports && medicalReports.length > 0 && (
          <section className="space-y-6">
            <h3 className="sub-header">Medical Reviews</h3>
            <ul className="space-y-5 ">
              {medicalReports
                ?.slice()
                .reverse()
                .map((report: any) => (
                  <li
                    key={report?.id}
                    className="space-y-9 flex flex-col border border-[#363a3d] rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm">
                        Date: {formatDate(report?.formDate) || "N/A"}
                      </p>
                    </div>

                    <div className="  items-center flex gap-2">
                      <p className="text-xs">Author: </p>
                      <p className="text-[13px]">
                        {report?.activtyCarriedOutBy}{" "}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">Title: </p>
                      <p className="text-[15px] ">{report?.title} </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">Summary: </p>
                      <p
                        className="text-[15px] "
                        dangerouslySetInnerHTML={{ __html: report?.report }}
                      />
                    </div>

                    <div className="flex my-2 items-center justify-between">
                      {report?.reportFile && (
                        <div className=" ">
                          <Button
                            type="button"
                            className="bg-blue-700"
                            onClick={() =>
                              window.open(report?.reportFile, "_blank")
                            }
                          >
                            View Report Document
                          </Button>
                        </div>
                      )}

                      {(user?.accessRole === AccessRole.Admin ||
                        user?.email === report?.activtyCarriedOutEmailBy) && (
                        <Button
                          type="button"
                          className="bg-red-800 gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setReportToDelete(report);
                            setIsDeleteReportModalOpen(true);
                          }}
                        >
                          Delete Report <Trash2Icon className="h-5" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </section>

      <section className="space-y-9">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Add New Review</h2>
        </div>

        {/* <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="reportDate"
          label="Report Date"
        /> */}

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="title"
          label="Title of Review"
          placeholder="Enter Title of Review"
        />

        <div style={{ color: "black" }} className="text-black">
          <TextEditor data={report} onDataChange={handleDescriptionChange} />
        </div>

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="reportFile"
          label="Add Review Document (if any)"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
      </section>

      {/* Add Save Button */}
      {title && report && (
        <section>
          <Button
            type="button"
            onClick={() => setIsAddReportModalOpen(true)}
            disabled={isLoading}
            className="flex bg-green-700 items-center gap-2"
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>{medicalReports?.length ? "Add Report" : "Submit Report"}</p>
            )}
          </Button>
        </section>
      )}
    </div>
  );
};

export default MedicalReports;
