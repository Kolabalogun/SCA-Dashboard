import { z } from "zod";

export const CreateEmployeeFormValidation = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string(),
  // .refine((phone) => /^\+\d{8,15}$/.test(phone), "Invalid phone number"),
  password: z
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
    ), // Special character
});

export const LoginFormValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z
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
    ), // Special character
});

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\d{13,14}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\d{13,14}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
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
  occupationHistory: z.string().optional(),

  primaryPhysician: z.string().min(2, "Select at least one physician"),
  primaryDoctor: z.string().optional(),

  // Medical Informations

  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  familyMembersComplains: z.string().optional(),
  patientsMembersComplains: z.string().optional(),
  socialWorkerFindings: z.string().optional(),
  patientNeeds: z.string().optional(),

  typeofDruguse: z.string().optional(),
  otherDrugs: z.string().optional(),
  quantityDrugsConsumedDaily: z.string().optional(),
  financilaImplicationsOfDrugAbuse: z.string().optional(),
  factorsThatLedToTheAbuse: z.string().optional(),

  diagnosis: z.string().optional(),
  newMedication: z.string().optional(),
  rehabilitationRecommendation: z.string().optional(),

  primaryEducation: z.string().optional(),
  secondaryEducation: z.string().optional(),
  tertiaryEducation: z.string().optional(),
  vocationalEducation: z.string().optional(),

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
  nextOfKinNumber: z
    .string()
    .refine((phone) => /^\d{13,14}$/.test(phone), "Invalid phone number"),

  dateOfAdmission: z.coerce.date().optional(),

  stayPeriods: z.string().optional(),

  paymentReceived: z.number().optional(),
  paymentHistory: z
    .array(
      z.object({
        id: z.string(),
        paymentReceived: z.number(),
        formDate: z.string(),
      })
    )
    .optional(),

  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
