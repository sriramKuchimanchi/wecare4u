/**
 * Core domain types for the We Care For You platform.
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

export type ApiResult<T> = { success: boolean; data?: T; error?: ApiError };
export type ApiError = { code: string; message: string; details?: Record<string, unknown> };
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type BaseEntity = { id: ID; createdAt: ISODateString; updatedAt: ISODateString };

export type Address = {
  line1: string; line2?: string; city: string; state: string;
  postalCode: string; country: string; latitude?: number; longitude?: number;
};

export type ContactInfo = { phone: string; email?: string; alternativePhone?: string };

export type User = BaseEntity & {
  name: string; email: string; phone: string; role: UserRole;
  avatarUrl?: string; isActive: boolean; lastLoginAt?: ISODateString;
};

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type AuthSession = {
  user: User; token: string; refreshToken?: string; expiresAt: ISODateString;
  permissions?: string[]; verificationStatus?: VerificationStatus;
  onboardingCompleted?: boolean; rememberMe?: boolean;
};

export type OtpChannel = 'sms' | 'email' | 'whatsapp';
export type OtpRequest = { channel: OtpChannel; target: string };
export type OtpVerify = { target: string; otp: string };
export type ProviderRegistrationType = 'individual' | 'organization';
export type ProfessionalCategory =
  | 'doctor' | 'nurse' | 'caregiver' | 'electrician' | 'plumber'
  | 'housekeeping' | 'lab-technician' | 'pharmacist';
export type OrganizationType =
  | 'hospital' | 'clinic' | 'pharmacy' | 'diagnostic-lab' | 'ambulance'
  | 'transportation' | 'home-care' | 'home-nursing' | 'other';
export type GovernmentIdType = 'aadhaar' | 'passport' | 'driving-license' | 'national-id' | 'other';

// ── Family ──────────────────────────────────────────────────────────────────

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'male' | 'female' | 'other';
export type MemberStatus = 'active' | 'inactive';

export type EmergencyContact = {
  name: string; relationship: string; phone: string; isPrimary?: boolean;
};

export type InsuranceInfo = {
  provider: string; policyNumber?: string; expiresAt?: ISODateString;
};

export type FamilyMember = BaseEntity & {
  familyId: ID;
  name: string;
  relationship: string;
  gender?: Gender;
  dateOfBirth?: ISODateString;
  avatarUrl?: string;
  bloodGroup?: BloodGroup;
  medicalConditions?: string[];
  allergies?: string[];
  insurance?: InsuranceInfo;
  emergencyContacts?: EmergencyContact[];
  governmentIdType?: GovernmentIdType;
  governmentIdNumber?: string;
  medicalNotes?: string;
  status: MemberStatus;
  notes?: string;
};

export type Family = BaseEntity & {
  userId: ID;
  name: string;
  primaryContactName: string;
  contact: ContactInfo;
  address: Address;
  members: FamilyMember[];
  emergencyContacts?: EmergencyContact[];
};

// ── Care Categories & Providers ───────────────────────────────────────────

export type CareCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
};

export type CareProviderType =
  | 'home-care' | 'nursing' | 'physiotherapy' | 'pharmacy' | 'laboratory'
  | 'transport' | 'medical-visit' | 'emergency' | 'doctor' | 'hospital'
  | 'caregiver' | 'electrician' | 'plumber' | 'housekeeping';

export type ProviderEmployee = {
  id: ID; name: string; role: string; experience: string;
  avatarUrl?: string; rating?: number; availability?: string;
};

export type ProviderReview = {
  id: ID; reviewerName: string; rating: number; comment: string;
  createdAt: ISODateString;
};

export type ProviderAvailabilitySlot = {
  date: ISODateString; slots: string[];
};

export type CareProvider = BaseEntity & {
  name: string;
  type: CareProviderType;
  description?: string;
  contact: ContactInfo;
  address: Address;
  rating?: number;
  reviewCount?: number;
  isVerified: boolean;
  services: string[];
  avatarUrl?: string;
  logoUrl?: string;
  employees?: ProviderEmployee[];
  reviews?: ProviderReview[];
  startingPrice?: number;
  currency?: string;
  experienceYears?: number;
  distanceKm?: number;
  estimatedArrivalMinutes?: number;
  availability?: 'available' | 'busy' | 'offline';
  photos?: string[];
};

// ── Care Requests ────────────────────────────────────────────────────────

export type CareRequestStatus =
  | 'pending' | 'accepted' | 'assigned' | 'on-way' | 'in-progress'
  | 'completed' | 'cancelled';

export type CareRequest = BaseEntity & {
  familyId: ID;
  memberId?: ID;
  providerId?: ID;
  employeeId?: ID;
  category: string;
  status: CareRequestStatus;
  scheduledAt: ISODateString;
  notes?: string;
  address?: Address;
  estimatedCost?: number;
  currency?: string;
};

// ── Appointments ──────────────────────────────────────────────────────────

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';

export type Appointment = BaseEntity & {
  familyId: ID;
  memberId?: ID;
  providerId: ID;
  providerName: string;
  serviceType: string;
  scheduledAt: ISODateString;
  durationMinutes?: number;
  status: AppointmentStatus;
  notes?: string;
  location?: string;
};

// ── Bookings (legacy) ─────────────────────────────────────────────────────
export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'failed';
export type Booking = BaseEntity & {
  familyId: ID; providerId: ID; serviceType: CareProviderType;
  scheduledAt: ISODateString; status: BookingStatus; notes?: string; employeeId?: ID;
};

// ── Emergency ─────────────────────────────────────────────────────────────
export type EmergencyStatus = 'triggered' | 'acknowledged' | 'dispatched' | 'resolved' | 'false-alarm';
export type Emergency = BaseEntity & {
  familyId: ID; type: string; status: EmergencyStatus;
  location?: Address; resolvedAt?: ISODateString; notes?: string;
};

// ── Timeline ──────────────────────────────────────────────────────────────
export type TimelineEventType =
  | 'care-request-submitted' | 'care-request-accepted' | 'care-request-completed'
  | 'appointment-scheduled' | 'appointment-completed' | 'medicine-delivered'
  | 'lab-test' | 'doctor-consultation' | 'emergency-triggered' | 'emergency-resolved'
  | 'medication-reminder' | 'member-added' | 'booking-created';

export type TimelineEntry = BaseEntity & {
  familyId: ID;
  memberId?: ID;
  eventType: TimelineEventType | string;
  title: string;
  description?: string;
  actorId?: ID;
  metadata?: Record<string, unknown>;
};

// ── Notifications ─────────────────────────────────────────────────────────
export type Notification = BaseEntity & {
  userId: ID; title: string; message: string; read: boolean;
  type: 'info' | 'warning' | 'success' | 'error'; link?: string;
};

// ── Medical Records ───────────────────────────────────────────────────────
export type MedicalRecord = BaseEntity & {
  familyMemberId: ID; type: string; title: string;
  description?: string; fileUrl?: string; recordedAt: ISODateString;
};

// ── Employee ──────────────────────────────────────────────────────────────
export type Employee = BaseEntity & {
  name: string; role: string; providerId?: ID; contact: ContactInfo;
  avatarUrl?: string; specialization?: string[];
};

// ── App Settings ──────────────────────────────────────────────────────────
export type AppSettings = {
  language: 'en' | 'ar' | 'fr' | 'es';
  timezone: string;
  notifications: { email: boolean; push: boolean; sms: boolean };
};
