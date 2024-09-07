export const GenderOptions = ["Male", "Female", "Other"];

export const DrugsOptions = ["Tobacco", "Alcohol", "Cannabis", "Cocaine"];

export const maritialStatusOptions = ["Single", "Married", "Other"];

export const PatientFormDefaultValues = {
  name: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  maritialStatus: "Single" as MaritalStatus,
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  occupationHistory: "",

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

export const AccessRoles = ["viewer", "editor", "admin"];

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
