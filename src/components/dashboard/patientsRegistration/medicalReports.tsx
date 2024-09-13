/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatJSDate";
import CustomFormField from "@/components/common/CustomFormField";
import { FileUploader } from "@/components/common/FileUploader";
import { FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { FormFieldType } from "@/types/types";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Naira } from "@/assets/icons";
import { uploadFileToStorage } from "@/lib/firebase";
import { useToast } from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useSelector } from "react-redux";
import showToast from "@/components/common/toast";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import TextEditor from "@/components/common/TextEditor";

type Props = {
  form: UseFormReturn<any>;
  patientDocId?: string;
};

const MedicalReports = ({ form, patientDocId }: Props) => {
  const toast = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const { title, report, medicalReports, name, reportDate, reportFile } =
    form.getValues();

  console.log(reportDate);

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

  console.log(form.formState.errors);
  console.log(medicalReports);

  const handleDescriptionChange = (data: string) => {
    form.setValue("report", data);
  };

  const handleAddReport = async (e: any) => {
    e.preventDefault();

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
        reportFileUrl = await uploadFileToStorage(report[0], name);
      }

      const newReport = {
        report,
        title,
        reportDate,
        reportFile: reportFileUrl,
        activtyCarriedOutBy: `${user?.firstName} ${user?.lastName}`,
        activtyCarriedOutEmailBy: `${user?.email}`,
        formDate: new Date().toISOString(),

        desc: `New Medical Report on ${name}`,
        reportRegisteredBy: `$
               createdAt: serverTimestamp(),{user?.firstName} ${user?.lastName}`,
        type: "Profile Update",
        patientDocId,
      };

      const newMedicalReports = [...medicalReportsss, newReport];

      // For Profile Update
      if (patientDocId) {
        const patientPayload = {
          ...form.getValues(),
          medicalReports: newMedicalReports,
        };

        const patientRef = doc(db, "patients", patientDocId);

        await updateDoc(patientRef, patientPayload);

        await setDoc(activitesRef, newReport);

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
    setIsLoading(true);
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
        onConfirm={() => handleDeleteReport(reportToDelete?.id)}
        onCancel={() => setIsDeleteReportModalOpen(false)}
        isLoading={deleteLoader}
        title="Delete Report"
        message="Are you sure you want to delete this Report?"
      />

      <section className="space-y-9">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Reports</h2>
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
          label="Title of Report"
          placeholder="Enter Title of Report"
        />

        <div style={{ color: "black" }} className="text-black">
          <TextEditor data={report} onDataChange={handleDescriptionChange} />
        </div>
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
              <p>
                {medicalReports?.length ? "Add New Report" : "Submit Report"}
              </p>
            )}
          </Button>
        </section>
      )}
    </div>
  );
};

export default MedicalReports;
