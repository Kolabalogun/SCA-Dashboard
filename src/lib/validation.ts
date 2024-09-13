import { z } from "zod";

// Reusable schemas for common fields
const nameSchema = z
  .string()
  .min(2, "Field must be at least 2 characters")
  .max(50, "Field must be at most 50 characters");

const emailSchema = z.string().email("Invalid email address");

const phoneSchema = z
  .string()
  .refine((phone) => /^\d{13,14}$/.test(phone), "Invalid phone number");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long") // Minimum length
  .max(32, "Password must be at most 32 characters long") // Maximum length
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  ) // Lowercase letter
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  ) // Uppercase letter
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must contain at least one number"
  ) // Number
  .refine(
    (password) => /[@$!%*?&]/.test(password),
    "Password must contain at least one special character"
  ); // Special character

// Reusable schema for consents
const consentSchema = z
  .boolean()
  .default(false)
  .refine((value) => value === true, {
    message: "You must consent to proceed",
  });

// Login Form Validation
export const LoginFormValidation = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Create Employee Form Validation
export const CreateEmployeeFormValidation = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const UserFormValidation = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export const AddRevenueValidation = z.object({
  type: nameSchema,
  receipt: z.custom<File[]>().optional(),
  amount: z.union([z.string(), z.number()]),

  patient: nameSchema,
  desc: nameSchema,
});

export const StaffFormValidation = z
  .object({
    confirmPassword: nameSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    status: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    middleName: nameSchema.optional(),
    birthDate: z.coerce.date(),
    gender: z.enum(["Male", "Female", "Other"]),
    maritialStatus: z.enum(["Single", "Married", "Other"]),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be at most 500 characters"),
    occupation: z.enum([
      "Administrator",
      "Doctor",
      "Psychiatric Physician",
      "Professional Care Officer",
      "Chef",
      "IT Officer",
      "Security",
      "Cleaner",
      "Manager",
      "Others",
    ]),
    accessRole: z.enum(["No Access", "Viewer", "Editor", "Admin"]),
    staffImage: z.union([z.string(), z.custom<File[]>()]).optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must be at most 32 characters long")
      .refine(
        (password) => /[a-z]/.test(password),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (password) => /[A-Z]/.test(password),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Password must contain at least one number"
      )
      .refine(
        (password) => /[@$!%*?&]/.test(password),
        "Password must contain at least one special character"
      ),

    // db
    logs: z
      .array(
        z.object({
          updatedBy: z.string(),
          updatedAt: z.coerce.date(),
        })
      )
      .optional(),
    updatedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Patient Form Validation
export const PatientFormValidation = UserFormValidation.extend({
  birthDate: z.coerce.date(),
  room: nameSchema,
  gender: z.enum(["Male", "Female", "Other"]),
  maritialStatus: z.enum(["Single", "Married", "Other"]),
  relativeMaritialStatus: z.enum(["Single", "Married", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  nextOfKinAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  nextOfKinRelationship: z
    .string()
    .min(5, "Field must be at least 5 characters")
    .max(500, "Field must be at most 500 characters"),
  nextOfKinOccupation: z
    .string()
    .min(5, "Field must be at least 5 characters")
    .max(500, "Field must be at most 500 characters"),
  nextOfKinName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  nextOfKinNumber: phoneSchema,
  treatmentConsent: consentSchema,
  disclosureConsent: consentSchema,
  privacyConsent: consentSchema,
  primaryPhysician: z.string().min(2, "Select at least one physician"),

  primaryDoctor: z.string().optional(),
  occupationHistory: z.string().optional(),
  // Medical Information fields
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  familyMembersComplains: z.string().optional(),
  patientsComplains: z.string().optional(),
  socialWorkerFindings: z.string().optional(),
  patientNeeds: z.string().optional(),
  typeOfDrugUse: z.string().optional(),
  otherDrugs: z.string().optional(),
  quantityDrugsConsumedDaily: z.string().optional(),
  financialImplicationsOfDrugAbuse: z.string().optional(),
  factorsThatLedToTheAbuse: z.string().optional(),
  diagnosis: z.string().optional(),
  newMedication: z.string().optional(),
  rehabilitationRecommendation: z.string().optional(),
  primaryEducation: z.string().optional(),
  secondaryEducation: z.string().optional(),
  tertiaryEducation: z.string().optional(),
  vocationalEducation: z.string().optional(),

  title: z.string().optional(),
  report: z.string().optional(),
  reportFile: z.custom<File[]>().optional(),
  medicalReports: z
    .array(
      z.object({
        title: z.string(),
        report: z.string(),
      })
    )
    .optional(),

  dateOfAdmission: z.coerce.date().optional(),
  stayPeriods: z.string().optional(),
  paymentReceived: z.union([z.string(), z.number()]).optional(),
  paymentHistory: z
    .array(
      z.object({
        // id: z.string(),
        paymentReceived: z.union([z.string(), z.number()]).optional(),
        formDate: z.string(),
        stayPeriods: z.string(),
      })
    )
    .optional(),
  paymentReceipt: z.custom<File[]>().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),

  // db
  logs: z
    .array(
      z.object({
        updatedBy: z.string(),
        updatedAt: z.coerce.date(),
      })
    )
    .optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
});
