/**
 * Core domain types for the We Care For You platform.
 * Future prompts will extend these as features are built.
 */

export type UserRole = 'family' | 'care-provider' | 'employee' | 'admin';

export type PortalType = Exclude<UserRole, 'admin'> | 'admin';

export type ID = string;

export type ISODateString = string;

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type BaseEntity = {
  id: ID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export type ContactInfo = {
  phone: string;
  email?: string;
  alternativePhone?: string;
};

export type User = BaseEntity & {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: ISODateString;
};

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type AuthSession = {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: ISODateString;
  permissions?: string[];
  verificationStatus?: VerificationStatus;
  onboardingCompleted?: boolean;
  rememberMe?: boolean;
};

export type OtpChannel = 'sms' | 'email' | 'whatsapp';

export type OtpRequest = {
  channel: OtpChannel;
  target: string;
};

export type OtpVerify = {
  target: string;
  otp: string;
};

export type ProviderRegistrationType = 'individual' | 'organization';

export type ProfessionalCategory =
  | 'doctor'
  | 'nurse'
  | 'caregiver'
  | 'electrician'
  | 'plumber'
  | 'housekeeping'
  | 'lab-technician'
  | 'pharmacist';

export type OrganizationType =
  | 'hospital'
  | 'clinic'
  | 'pharmacy'
  | 'diagnostic-lab'
  | 'ambulance'
  | 'transportation'
  | 'home-care'
  | 'home-nursing'
  | 'other';

export type GovernmentIdType = 'aadhaar' | 'passport' | 'driving-license' | 'national-id' | 'other';

export type FamilyMember = BaseEntity & {
  familyId: ID;
  name: string;
  relationship: string;
  dateOfBirth?: ISODateString;
  avatarUrl?: string;
  notes?: string;
};

export type Family = BaseEntity & {
  name: string;
  primaryContactName: string;
  contact: ContactInfo;
  address: Address;
  members: FamilyMember[];
};

export type CareProviderType =
  | 'home-care'
  | 'nursing'
  | 'physiotherapy'
  | 'pharmacy'
  | 'laboratory'
  | 'transport'
  | 'medical-visit'
  | 'emergency';

export type CareProvider = BaseEntity & {
  name: string;
  type: CareProviderType;
  description?: string;
  contact: ContactInfo;
  address: Address;
  rating?: number;
  isVerified: boolean;
  services: string[];
  avatarUrl?: string;
};

export type Employee = BaseEntity & {
  name: string;
  role: string;
  providerId?: ID;
  contact: ContactInfo;
  avatarUrl?: string;
  specialization?: string[];
};

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type Booking = BaseEntity & {
  familyId: ID;
  providerId: ID;
  serviceType: CareProviderType;
  scheduledAt: ISODateString;
  status: BookingStatus;
  notes?: string;
  employeeId?: ID;
};

export type EmergencyStatus =
  | 'triggered'
  | 'acknowledged'
  | 'dispatched'
  | 'resolved'
  | 'false-alarm';

export type Emergency = BaseEntity & {
  familyId: ID;
  type: string;
  status: EmergencyStatus;
  location?: Address;
  resolvedAt?: ISODateString;
  notes?: string;
};

export type TimelineEntry = BaseEntity & {
  familyId: ID;
  eventType: string;
  title: string;
  description?: string;
  actorId?: ID;
  metadata?: Record<string, unknown>;
};

export type Notification = BaseEntity & {
  userId: ID;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
};

export type MedicalRecord = BaseEntity & {
  familyMemberId: ID;
  type: string;
  title: string;
  description?: string;
  fileUrl?: string;
  recordedAt: ISODateString;
};

export type AppSettings = {
  language: 'en' | 'ar' | 'fr' | 'es';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
};
