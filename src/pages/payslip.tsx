/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import SubmitButton from "@/components/common/SubmitButton";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import showToast from "@/components/common/toast";
import { AccessRole } from "@/types/types";
import PayslipForm from "@/components/dashboard/payslip/form";
import PayslipDocument from "@/components/dashboard/payslip/document";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { payslipInitialState } from "@/constants";

const PaySlip = () => {
  const toast = useToast();

  const { user } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState(payslipInitialState);
  //   const [isLoading, setIsLoading] = useState(false);
  console.log(form);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    basicSalary,
    rent_allowance,
    hazard_allowance,
    travel_allowance,
    grossEarnings,
    salary_tax,
    grossDeduction,
    pension_deduction,
  } = form;

  useEffect(() => {
    const computeEquations = () => {
      const monthNumber = new Date(form.payslipCurrentMonth).getMonth() + 1; // Convert month to numeric value
      const dateOfAppointment = new Date(form.dateofappointment);
      const currentMonthDate = new Date(form.payslipCurrentMonth);

      // Calculate number of months between dateOfAppointment and payslipCurrentMonth
      const monthDiff =
        currentMonthDate.getFullYear() * 12 +
        currentMonthDate.getMonth() -
        (dateOfAppointment.getFullYear() * 12 + dateOfAppointment.getMonth());

      // Compute salary tax and pension deduction
      if (basicSalary) {
        const salaryTax = 0.1 * parseFloat(basicSalary);
        const pensionTax = 0.08 * parseFloat(basicSalary);
        const grossDeduction = salaryTax + pensionTax;

        setForm((prev: any) => ({
          ...prev,
          salary_tax: salaryTax,
          pension_deduction: pensionTax,
          grossDeduction,
        }));
      }

      // Compute gross earnings
      if (
        basicSalary ||
        rent_allowance ||
        hazard_allowance ||
        travel_allowance
      ) {
        const grossEarnings =
          parseFloat(basicSalary) +
          parseFloat(rent_allowance) +
          parseFloat(travel_allowance) +
          parseFloat(hazard_allowance);

        setForm((prev: any) => ({
          ...prev,
          grossEarnings,
        }));
      }

      // Compute net earnings
      if (grossDeduction || grossEarnings) {
        const netEarnings =
          parseFloat(grossEarnings) - parseFloat(grossDeduction);

        setForm((prev: any) => ({
          ...prev,
          netEarnings,
        }));
      }

      // Compute cummulative income based on current month
      if (monthNumber && grossEarnings) {
        const cummulative_income = monthNumber * parseFloat(grossEarnings);

        setForm((prev: any) => ({
          ...prev,
          cummulative_income,
        }));
      }

      // Compute cummulative tax deduction based on current month
      if (monthNumber && salary_tax) {
        const cummulative_tax_deduction = monthNumber * parseFloat(salary_tax);

        setForm((prev: any) => ({
          ...prev,
          cummulative_tax_deduction,
        }));
      }

      // Compute cummulative pension based on the number of months between appointment and payslipCurrentMonth
      if (monthDiff >= 0 && pension_deduction) {
        const cummulative_pension = monthDiff * parseFloat(pension_deduction);

        setForm((prev: any) => ({
          ...prev,
          cummulative_pension,
        }));
      }
    };

    computeEquations();
  }, [
    basicSalary,
    rent_allowance,
    hazard_allowance,
    travel_allowance,
    grossDeduction,
    grossEarnings,

    salary_tax,
    pension_deduction,
    form.dateofappointment,
    form.payslipCurrentMonth,
  ]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.accessRole !== AccessRole.Admin)
        return showToast(
          toast,
          "Access Denied",
          "warning",
          "You don't have access to generate Payslip"
        );

      showToast(toast, "Payslip", "success", "Payslip generated successfully");
    } catch (error) {
      console.log(error);
      showToast(toast, "Payslip", "error", "Error generating payslip ");
    }
  };

  return (
    <div className="container    flex flex-col  ">
      <div className="flex flex-col mb-10  space-y-14">
        <main>
          <section className="w-full space-y-4 mb-8">
            <h1 className="header capitalize ">Generate Payslips</h1>

            <p className="text-dark-700">Enter the payment details below</p>
          </section>

          <form onSubmit={onSubmit} className="flex-1 space-y-12">
            <PayslipForm
              setForm={setForm}
              handleChange={handleChange}
              form={form}
            />

            <div className="w-full">
              <PDFDownloadLink
                document={<PayslipDocument payslipData={form} />}
                fileName={`payslip-${form.payslipNo}.pdf`}
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginTop: "20px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "#24ae7c",
                  width: "100%",
                }}
              >
                {({ loading }) => (
                  <SubmitButton type="button" isLoading={loading}>
                    Generate
                  </SubmitButton>
                )}
              </PDFDownloadLink>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default PaySlip;
