import { z } from 'zod';

/**
 * Reusable Zod schemas for forms across the platform.
 * Future prompts compose these into feature-specific schemas.
 */

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');
export const phoneSchema = z
  .string()
  .min(7, 'Enter a valid phone number')
  .regex(/^[+]?[\d\s()-]{7,20}$/, 'Enter a valid phone number');
export const nameSchema = z.string().trim().min(2, 'Name is too short').max(80, 'Name is too long');
export const otpSchema = z
  .string()
  .trim()
  .min(4, 'Enter the OTP code')
  .max(6, 'OTP cannot be longer than 6 digits')
  .regex(/^\d{4,6}$/, 'Enter a valid numeric code');
export const requiredTextSchema = z.string().trim().min(1, 'This field is required');
export const pincodeSchema = z.string().trim().min(3, 'Enter a valid pincode').max(10, 'Enter a valid pincode');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const providerLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const employeeLoginSchema = z.object({
  identifier: z.string().trim().min(2, 'Enter your employee ID or email'),
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    role: z.enum(['family', 'care-provider', 'employee', 'admin']),
    acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpVerifySchema = z.object({
  otp: otpSchema,
});

export const addressSchema = z.object({
  line1: requiredTextSchema,
  line2: z.string().optional(),
  city: requiredTextSchema,
  state: requiredTextSchema,
  postalCode: requiredTextSchema,
  country: z.string().default('United Arab Emirates'),
});

/* ---------- Family Registration (multi-step) ---------- */

export const familyStep1Schema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  otp: otpSchema,
  acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
});

export const familyStep2Schema = z.object({
  familyName: nameSchema,
  address: requiredTextSchema,
  state: requiredTextSchema,
  district: requiredTextSchema,
  city: requiredTextSchema,
  pincode: pincodeSchema,
  emergencyContact: phoneSchema,
});

export const familyStep3Schema = z.object({
  memberName: nameSchema,
  relationship: requiredTextSchema,
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().min(1, 'Enter a date of birth'),
  bloodGroup: z.string().min(1, 'Select a blood group'),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  insuranceProvider: z.string().optional(),
  memberEmergencyContact: phoneSchema.optional().or(z.literal('')),
  governmentIdType: z.enum(['aadhaar', 'passport', 'driving-license', 'national-id', 'other']),
  governmentIdNumber: requiredTextSchema,
});

/* ---------- Care Provider Registration ---------- */

export const providerTypeSchema = z.object({
  type: z.enum(['individual', 'organization']),
});

export const providerIndividualSchema = z.object({
  businessName: nameSchema,
  category: z.enum([
    'doctor', 'nurse', 'caregiver', 'electrician', 'plumber',
    'housekeeping', 'lab-technician', 'pharmacist',
  ]),
  phone: phoneSchema,
  email: emailSchema,
  address: requiredTextSchema,
  experience: z.string().min(1, 'Enter years of experience'),
  licenseNumber: requiredTextSchema,
});

export const providerOrganizationSchema = z.object({
  organizationName: nameSchema,
  organizationType: z.enum([
    'hospital', 'clinic', 'pharmacy', 'diagnostic-lab',
    'ambulance', 'transportation', 'home-care', 'home-nursing', 'other',
  ]),
  registrationNumber: requiredTextSchema,
  gst: z.string().min(1, 'Enter GST number'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  email: emailSchema,
  phone: phoneSchema,
  address: requiredTextSchema,
  city: requiredTextSchema,
  district: requiredTextSchema,
  state: requiredTextSchema,
  pincode: pincodeSchema,
  primaryContactPerson: nameSchema,
});

/* ---------- Forgot / Reset Password ---------- */

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProviderLoginInput = z.infer<typeof providerLoginSchema>;
export type EmployeeLoginInput = z.infer<typeof employeeLoginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpVerifySchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FamilyStep1Input = z.infer<typeof familyStep1Schema>;
export type FamilyStep2Input = z.infer<typeof familyStep2Schema>;
export type FamilyStep3Input = z.infer<typeof familyStep3Schema>;
export type ProviderTypeInput = z.infer<typeof providerTypeSchema>;
export type ProviderIndividualInput = z.infer<typeof providerIndividualSchema>;
export type ProviderOrganizationInput = z.infer<typeof providerOrganizationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
