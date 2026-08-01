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
  id?: ID;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
  priority?: 'primary' | 'secondary' | 'normal';
  preferredLanguage?: string;
  avatarUrl?: string;
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
  estimatedResponseTime?: string;
};

export type CareProviderType =
  | 'home-care' | 'nursing' | 'physiotherapy' | 'pharmacy' | 'laboratory'
  | 'transport' | 'medical-visit' | 'emergency' | 'doctor' | 'hospital'
  | 'caregiver' | 'electrician' | 'plumber' | 'housekeeping' | 'other';

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
  businessHours?: string;
  coverageArea?: string;
  languagesSpoken?: string[];
  emergencyAvailable?: boolean;
};

// ── Care Requests ────────────────────────────────────────────────────────

export type CareRequestStatus =
  | 'pending'
  | 'accepted'
  | 'employee_assigned'
  | 'professional_assigned'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'awaiting_review'
  | 'cancelled'
  | 'requested';

export type CareRequestPriority = 'urgent' | 'emergency' | 'standard' | 'scheduled';

export type CareRequestTimelineStep = {
  status: CareRequestStatus;
  title: string;
  timestamp: ISODateString;
  description?: string;
};

export type CareRequest = BaseEntity & {
  familyId: ID;
  familyName?: string;
  memberId?: ID;
  patientName?: string;
  memberName?: string;
  providerId?: ID;
  providerName?: string;
  employeeId?: ID;
  employeeName?: string;
  employeeRole?: string;
  employeePhone?: string;
  category: string;
  categoryLabel?: string;
  priority?: CareRequestPriority;
  status: CareRequestStatus;
  scheduledAt: ISODateString;
  notes?: string;
  medicalNotes?: string;
  internalNotes?: string[];
  address?: Address;
  estimatedCost?: number;
  currency?: string;
  rating?: number;
  estimatedArrivalMinutes?: number;
  estimatedDuration?: string;
  timeline?: CareRequestTimelineStep[];
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

// ── Emergency SOS & Live Activity ─────────────────────────────────────────

export type EmergencyWorkflowStep =
  | 'sos_triggered'
  | 'location_detected'
  | 'coordinator_activated'
  | 'provider_found'
  | 'professional_assigned'
  | 'ambulance_assigned'
  | 'hospital_notified'
  | 'contacts_notified'
  | 'live_updates'
  | 'resolved';

export type EmergencyStepDetail = {
  step: EmergencyWorkflowStep;
  title: string;
  description: string;
  completedAt?: ISODateString;
  status: 'pending' | 'in-progress' | 'completed';
};

export type EmergencySession = BaseEntity & {
  familyId: ID;
  memberId?: ID;
  memberName?: string;
  status: 'active' | 'resolved' | 'cancelled';
  currentStepIndex: number;
  steps: EmergencyStepDetail[];
  location: Address & { lat?: number; lng?: number };
  assignedProvider?: { id: string; name: string; phone: string; etaMinutes: number };
  assignedProfessional?: { id: string; name: string; role: string; phone: string };
  assignedAmbulance?: { vehicleNumber: string; driverName: string; phone: string; etaMinutes: number };
  notifiedHospital?: { name: string; phone: string; address: string };
  notifiedContactsCount: number;
  trackingCoords?: { lat: number; lng: number };
};

// ── AI Assistant & Smart Actions ──────────────────────────────────────────

export type SmartActionType =
  | 'request_care'
  | 'emergency_sos'
  | 'call_emergency_contact'
  | 'view_nearby_hospitals'
  | 'view_care_providers'
  | 'schedule_appointment'
  | 'medication_reminder';

export type SmartActionCard = {
  id: string;
  label: string;
  actionType: SmartActionType;
  icon?: string;
  tone?: 'primary' | 'secondary' | 'danger';
  payload?: Record<string, unknown>;
};

export type AiChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: ISODateString;
  actions?: SmartActionCard[];
};

// ── Medication Reminders ──────────────────────────────────────────────────

export type MedicationStatus = 'pending' | 'taken' | 'skipped' | 'snoozed';

export type MedicationReminder = BaseEntity & {
  familyId: ID;
  memberId: ID;
  memberName: string;
  medicineName: string;
  dosage: string;
  time: string;
  frequency: string;
  status: MedicationStatus;
  instructions?: string;
  lastActionAt?: ISODateString;
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
export type EmployeeAvailabilityStatus = 'available' | 'busy' | 'offline' | 'on_leave' | 'emergency_duty';

export type EmployeeDocumentItem = {
  id: ID;
  title: string;
  type: string;
  fileUrl: string;
  uploadedAt: ISODateString;
  status: 'verified' | 'pending' | 'rejected';
};

export type Employee = BaseEntity & {
  name: string;
  role: string;
  department?: string;
  experience?: string;
  licenseNumber?: string;
  providerId?: ID;
  contact: ContactInfo;
  address?: Address;
  languages?: string[];
  availability: EmployeeAvailabilityStatus;
  workingDays?: string[];
  workingHours?: string;
  governmentIdType?: GovernmentIdType;
  governmentIdNumber?: string;
  certificates?: string[];
  emergencyContact?: EmergencyContact;
  status: 'active' | 'inactive' | 'deactivated';
  avatarUrl?: string;
  rating?: number;
  reviewCount?: number;
  assignedRequestsCount?: number;
  completedRequestsCount?: number;
  documents?: EmployeeDocumentItem[];
  specialization?: string[];
};

// ── Care Provider Additional Models ──────────────────────────────────────
export type ProviderServiceItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  enabled: boolean;
  pricing: { amount: number; unit: string; currency: string };
  responseTime: string;
  coverageArea: string;
};

export type AvailabilityConfig = {
  businessHours: { day: string; open: string; close: string; isClosed: boolean }[];
  emergencyAvailable: boolean;
  holidaySchedule: { date: string; name: string; isClosed: boolean }[];
  closedDays: string[];
  coverageRadiusKm: number;
};

export type OrganizationProfile = {
  id: ID;
  logoUrl?: string;
  name: string;
  registrationNumber: string;
  gstNumber?: string;
  verificationStatus: VerificationStatus;
  address: Address;
  contact: ContactInfo;
  website: string;
  businessHours: string;
  serviceCategories: string[];
};

export type ProviderDocument = {
  id: ID;
  title: string;
  type: 'registration' | 'gst' | 'license' | 'insurance' | 'employee' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: ISODateString;
  verificationStatus: VerificationStatus;
  notes?: string;
};

export type ServiceNote = {
  id: ID;
  requestId: ID;
  employeeId: ID;
  visitNotes: string;
  observations: string;
  recommendations: string;
  followUpNeeded: boolean;
  followUpDetails?: string;
  attachments?: { name: string; url: string }[];
  createdAt: ISODateString;
};

// ── App Settings ──────────────────────────────────────────────────────────
export type AppSettings = {
  language: 'en' | 'ar' | 'fr' | 'es';
  timezone: string;
  notifications: { email: boolean; push: boolean; sms: boolean };
};

// ── Booking ──────────────────────────────────────────────────────────────────
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type Booking = BaseEntity & {
  familyId: ID;
  providerId: ID;
  serviceType: string;
  scheduledAt: ISODateString;
  status: BookingStatus;
  employeeId?: ID;
  notes?: string;
  estimatedCost?: number;
  currency?: string;
};

// ── Emergency (alias) ─────────────────────────────────────────────────────────
export type Emergency = EmergencySession;
