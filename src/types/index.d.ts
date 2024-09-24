declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type MaritalStatus = "Single" | "Married" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";
declare type AccessRole = "No Access" | "Viewer" | "Editor" | "Admin";
declare type PStatus = "Admitted" | "Discharged" | "Others";

declare type StaffOccupation =
  | "Administrator"
  | "Doctor"
  | "Psychiatric Physician"
  | "Professional Care Officer"
  | "Chef"
  | "Security"
  | "Cleaner"
  | "Others"
  | "Manager";

declare interface EmployeeUserParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passowrd: string;
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  nextOfKinName: string;
  nextOfKinNumber: string;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  nextOfKinName: string;
  nextOfKinNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}
