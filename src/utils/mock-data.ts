import type { Family, CareProvider, Employee, Booking, Emergency, TimelineEntry, Notification, MedicalRecord, User } from '@/types';

const now = () => new Date().toISOString();

export const mockUsers: User[] = [
  {
    id: 'user_family_1',
    name: 'Aisha Rahman',
    email: 'aisha.family@example.com',
    phone: '+971 50 123 4567',
    role: 'family',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'user_provider_1',
    name: 'Dr. Omar Health Services',
    email: 'omar.provider@example.com',
    phone: '+971 50 987 6543',
    role: 'care-provider',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'user_employee_1',
    name: 'Layla Nurse',
    email: 'layla.employee@example.com',
    phone: '+971 50 555 1212',
    role: 'employee',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'user_admin_1',
    name: 'Platform Administrator',
    email: 'admin@wecareforyou.app',
    phone: '+971 50 000 0000',
    role: 'admin',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockFamilies: Family[] = [
  {
    id: 'fam_1',
    name: 'Rahman Family',
    primaryContactName: 'Aisha Rahman',
    contact: { phone: '+971 50 123 4567', email: 'aisha.family@example.com' },
    address: {
      line1: 'Marina Heights, Apt 1203',
      city: 'Dubai',
      state: 'Dubai',
      postalCode: '00000',
      country: 'United Arab Emirates',
    },
    members: [],
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockCareProviders: CareProvider[] = [
  {
    id: 'prov_1',
    name: 'Sunrise Home Care',
    type: 'home-care',
    description: 'Compassionate in-home care for seniors.',
    contact: { phone: '+971 4 333 1111' },
    address: {
      line1: 'Jumeirah Street',
      city: 'Dubai',
      state: 'Dubai',
      postalCode: '00000',
      country: 'United Arab Emirates',
    },
    isVerified: true,
    rating: 4.8,
    services: ['personal-care', 'companionship', 'medication-reminders'],
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp_1',
    name: 'Layla Nurse',
    role: 'Registered Nurse',
    providerId: 'prov_1',
    contact: { phone: '+971 50 555 1212' },
    specialization: ['geriatric-care', 'wound-care'],
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'book_1',
    familyId: 'fam_1',
    providerId: 'prov_1',
    serviceType: 'home-care',
    scheduledAt: now(),
    status: 'pending',
    employeeId: 'emp_1',
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockEmergencies: Emergency[] = [];

export const mockTimeline: TimelineEntry[] = [
  {
    id: 'tl_1',
    familyId: 'fam_1',
    eventType: 'booking-created',
    title: 'New booking created',
    description: 'Sunrise Home Care scheduled for personal care.',
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_family_1',
    title: 'Welcome to We Care For You',
    message: 'Your account has been created successfully.',
    read: false,
    type: 'success',
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockMedicalRecords: MedicalRecord[] = [];
