export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export enum AccessRole {
  No_Access = "No Access",
  Viewer = "Viewer",
  Editor = "Editor",
  PatientEditor = "PatientEditor",
  Admin = "Admin",
}

export interface PayslipDataInterface {
  payslipNo: string;
  payslipCurrentMonth: Date;
  employmentNo: string;
  gender: string;
  occupation: string;
  fullName: string;
  address: string;
  dateofappointment: Date;
  basicSalary: number;
  rent_allowance: number;
  hazard_allowance: number;
  travel_allowance: number;
  grossEarnings: number;
  salary_tax: number;
  grossDeduction: number;
  pension_deduction: number;
  netEarnings: number;
  cummulative_income: number;
  cummulative_tax_deduction: number;
  cummulative_pension: number;
  shouldDownload: boolean;
}
