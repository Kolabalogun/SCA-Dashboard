export const GenderOptions = ["Male", "Female", "Other"];

export const DrugsOptions = ["Tobacco", "Alcohol", "Cannabis", "Cocaine"];

export const maritialStatusOptions = ["Single", "Married", "Other"];

export const AddRevenueDefaultValues = {
  type: "",
  // createdAt: new Date(Date.now()),

  // id: "",
  patient: "",
  receipt: [],
  amount: 0,
  desc: "",
};

export const StaffFormDefaultValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  maritialStatus: "Single" as MaritalStatus,
  gender: "Male" as Gender,
  address: "",
  occupation: "Administrator" as StaffOccupation,
  accessRole: "No Access" as AccessRole,
  password: "",
  confirmPassword: "",
  staffImage: [],
  status: "Active",

  // db
  logs: [],
  updatedAt: new Date(Date.now()),
};

export const PatientFormDefaultValues = {
  name: "",
  email: "",
  room: "",
  phone: "",
  birthDate: new Date(Date.now()),
  maritialStatus: "Single" as MaritalStatus,
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  occupationHistory: "",
  patientStatus: "Admitted" as const,

  // Medical Information
  primaryPhysician: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",

  // Relatives
  familyMembersComplains: "",
  patientsComplains: "",

  //Education

  primaryEducation: "",
  tertiaryEducation: "",
  vocationalEducation: "",
  secondaryEducation: "",

  // Drug Abuse
  typeOfDrugUse: "",
  otherDrugs: "",
  quantityDrugsConsumedDaily: "",
  financialImplicationsOfDrugAbuse: "",
  factorsThatLedToTheAbuse: "",

  // Doctor Information
  primaryDoctor: "",
  familyMembersComplaints: "",
  socialWorkerFindings: "",
  patientNeeds: "",
  diagnosis: "",
  newMedication: "",
  rehabilitationRecommendation: "",

  // Medical Reports
  medicalReports: [],
  reportFile: [],
  title: "",
  report: "",
  reportDate: new Date(Date.now()),

  // Identification
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,

  // Next of Kin
  nextOfKinName: "",
  nextOfKinNumber: "",
  nextOfKinOccupation: "",
  nextOfKinAddress: "",
  nextOfKinRelationship: "",
  relativeMaritialStatus: "Single" as MaritalStatus,

  // Payment
  dateOfAdmission: new Date(Date.now()),
  stayPeriods: "",
  paymentReceived: "",
  paymentHistory: [],
  otherPaymentInformation: {},
  paymentReceipt: [],

  // db
  logs: [],
  updatedAt: new Date(Date.now()),
};

export const stayPeriods = [
  "1 month",
  "2 months",
  "3 months",
  "6 months",
  "12 months",
  "15 months",
  "18 months",
  "24 months",
  "2 years +",
];

export const AccessRoles = [
  "No Access",
  "Viewer",
  "PatientEditor",
  "Editor",
  "Admin",
];

export const StaffOccupations = [
  "Administrator",
  "Doctor",
  "Psychiatric Physician",
  "Professional Care Officer",
  "Manager",
  "Social Worker",
  "Chef",
  "IT Officer",
  "Security",
  "Cleaner",
  "Others",
];

export const PatientStatusOption = ["Admitted", "Discharged", "Others"];

export const StaffStatusOption = [
  "Active",
  "On Leave",
  "Released",
  "Sacked",
  "Others",
];

export const RevenueTypeOptions = [
  "Government Grant",
  "Donations",
  "Private Patient",
  "Teaching and Educational Programs",
  "Others",
];

export const ExpensesTypeOptions = [
  "Salary",
  "Medical Supplies",
  "Fuel",
  "Utilities",
  "Building Maintenance and Operations",
  "Research and Development",
  "Waste Management",
  "Food",
  "Others",
];

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/src/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/src/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },

  {
    image: "/src/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/src/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
];

export const StatusIcon = {
  scheduled: "/src/assets/icons/check.svg",
  pending: "/src/assets/icons/pending.svg",
  cancelled: "/src/assets/icons/cancelled.svg",
};
