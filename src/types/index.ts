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
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

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
  attachments?: CareRequestAttachment[];
  address?: Address;
  estimatedCost?: number;
  currency?: string;
  rating?: number;
  estimatedArrivalMinutes?: number;
  estimatedDuration?: string;
  timeline?: CareRequestTimelineStep[];
};

export type CareRequestAttachment = {
  id: string;
  name: string;
  url: string;
  kind: 'image' | 'document';
  uploadedAt: ISODateString;
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

// ── Service Provider Additional Models ───────────────────────────────────
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
  contactNumber?: string;
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

// ── Administrator Portal Types ───────────────────────────────────────────────

export type ProviderVerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'under_review';

export type AdminPlatformStats = {
  totalFamilies: number;
  totalFamilyMembers: number;
  totalProviders: number;
  totalEmployees: number;
  pendingProviderVerifications: number;
  pendingEmployeeVerifications: number;
  todayCareRequests: number;
  todayEmergencies: number;
  activeEmergencies: number;
  completedEmergencies: number;
  activeCareRequests: number;
  completedCareRequests: number;
  pendingReviews: number;
  platformHealth: number; // 0-100
};

export type AdminActivity = {
  id: ID;
  type: 'family_registered' | 'provider_registered' | 'employee_added' | 'care_requested'
    | 'sos_triggered' | 'provider_approved' | 'review_submitted' | 'request_completed'
    | 'emergency_resolved' | 'employee_verified' | 'provider_suspended' | 'document_uploaded';
  title: string;
  description: string;
  actorName?: string;
  actorRole?: UserRole | 'system';
  entityId?: ID;
  entityType?: 'family' | 'provider' | 'employee' | 'request' | 'emergency' | 'review' | 'document';
  severity?: 'info' | 'warning' | 'critical';
  createdAt: ISODateString;
};

export type AdminFamily = Family & {
  activeRequestsCount: number;
  totalRequestsCount: number;
  emergencyCount: number;
  status: 'active' | 'inactive' | 'flagged';
  lastActivity?: ISODateString;
};

export type AdminProvider = CareProvider & {
  verificationStatus: ProviderVerificationStatus;
  employeeCount: number;
  activeRequestsCount: number;
  totalRequestsCount: number;
  documentsCount: number;
  pendingDocuments: number;
  lastActivity?: ISODateString;
  rejectionReason?: string;
  submittedAt?: ISODateString;
};

export type AdminEmployee = Employee & {
  providerName?: string;
  verificationStatus: ProviderVerificationStatus;
  activeRequestsCount: number;
};

export type AdminCareRequest = CareRequest & {
  adminNotes?: string;
  flagged?: boolean;
};

export type AdminEmergency = EmergencySession & {
  priority: 'critical' | 'high' | 'medium';
  responseTimeMinutes?: number;
  escalated?: boolean;
};

export type VerificationDocument = {
  id: ID;
  title: string;
  type: 'registration' | 'gst' | 'license' | 'insurance' | 'employee' | 'certificate' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: ISODateString;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
};

export type VerificationRequest = {
  id: ID;
  entityType: 'provider' | 'employee';
  entityId: ID;
  entityName: string;
  organizationName?: string;
  contactEmail?: string;
  contactPhone?: string;
  submittedAt: ISODateString;
  status: ProviderVerificationStatus;
  documents: VerificationDocument[];
  registrationNumber?: string;
  gstNumber?: string;
  licenseNumber?: string;
  reviewedBy?: string;
  reviewedAt?: ISODateString;
  rejectionReason?: string;
  notes?: string;
  avatarUrl?: string;
};

export type ServiceCategory = {
  id: ID;
  name: string;
  icon: string;
  description: string;
  color: string;
  enabled: boolean;
  providerCount: number;
  requestCount: number;
  createdAt: ISODateString;
};

export type AdminDocument = VerificationDocument & {
  ownerName: string;
  ownerType: 'provider' | 'employee';
  ownerId: ID;
  providerName?: string;
};

export type AdminReview = {
  id: ID;
  reviewerName: string;
  reviewerFamilyId?: ID;
  providerId: ID;
  providerName: string;
  employeeId?: ID;
  employeeName?: string;
  patientName?: string;
  rating: number;
  comment: string;
  isComplaint: boolean;
  status: 'pending' | 'responded' | 'flagged' | 'resolved';
  response?: { text: string; respondedAt: ISODateString };
  createdAt: ISODateString;
};

export type AdminNotification = {
  id: ID;
  type: 'emergency' | 'verification' | 'system' | 'provider' | 'announcement';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  entityId?: ID;
  entityType?: string;
  createdAt: ISODateString;
};

export type PlatformAnalytics = {
  familyGrowth: { month: string; count: number }[];
  providerGrowth: { month: string; count: number }[];
  employeeGrowth: { month: string; count: number }[];
  requestTrends: { month: string; total: number; emergency: number; completed: number }[];
  emergencyTrends: { month: string; count: number; avgResponseMins: number }[];
  categoryUsage: { category: string; count: number; percentage: number }[];
  ratingsDistribution: { rating: number; count: number }[];
  avgResponseTimeMinutes: number;
  topProviders: { id: ID; name: string; rating: number; requestCount: number }[];
  topEmployees: { id: ID; name: string; rating: number; completedCount: number }[];
  mostRequestedServices: { service: string; count: number }[];
};

export type PlatformSettings = {
  platformName: string;
  platformTagline: string;
  supportEmail: string;
  supportPhone: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  emergencyResponseTargetMinutes: number;
  verificationRequiredForProviders: boolean;
  verificationRequiredForEmployees: boolean;
  allowSelfRegistration: boolean;
  maxFamilyMembers: number;
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    emergencyAlerts: boolean;
    verificationAlerts: boolean;
    systemAlerts: boolean;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    darkModeDefault: boolean;
  };
  pwa: {
    enabled: boolean;
    offlineSupport: boolean;
    backgroundSync: boolean;
  };
};

