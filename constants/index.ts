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
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
