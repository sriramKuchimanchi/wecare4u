import type {
  Family, FamilyMember, CareProvider, CareRequest, Appointment,
  TimelineEntry, Notification, User, Employee, Booking, Emergency, MedicalRecord, CareCategory,
} from '@/types';

const now = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 3600000).toISOString();
const daysFromNow = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

export const mockUsers: User[] = [
  { id: 'user_family_1', name: 'Aisha Rahman', email: 'aisha.family@example.com', phone: '+971 50 123 4567', role: 'family', isActive: true, createdAt: now(), updatedAt: now() },
  { id: 'user_provider_1', name: 'Dr. Omar Health Services', email: 'omar.provider@example.com', phone: '+971 50 987 6543', role: 'care-provider', isActive: true, createdAt: now(), updatedAt: now() },
  { id: 'user_employee_1', name: 'Layla Nurse', email: 'layla.employee@example.com', phone: '+971 50 555 1212', role: 'employee', isActive: true, createdAt: now(), updatedAt: now() },
  { id: 'user_admin_1', name: 'Platform Administrator', email: 'admin@lomaa.com', phone: '+971 50 000 0000', role: 'admin', isActive: true, createdAt: now(), updatedAt: now() },
];

export const mockCareCategories: CareCategory[] = [
  { id: 'doctor', label: 'Doctor', icon: 'Stethoscope', description: 'Home visit or clinic consultation', color: 'primary', estimatedResponseTime: '15-30 mins' },
  { id: 'hospital', label: 'Hospital', icon: 'Building2', description: 'Hospital admission or emergency care', color: 'secondary', estimatedResponseTime: 'Immediate' },
  { id: 'caregiver', label: 'Caregiver', icon: 'Users', description: 'Daily living support & companionship', color: 'primary', estimatedResponseTime: '30-45 mins' },
  { id: 'home-nurse', label: 'Home Nurse', icon: 'HeartPulse', description: 'Professional nursing at home', color: 'secondary', estimatedResponseTime: '20-40 mins' },
  { id: 'medicine', label: 'Medicine Delivery', icon: 'Pill', description: 'Prescription & OTC delivery', color: 'primary', estimatedResponseTime: '30-60 mins' },
  { id: 'laboratory', label: 'Diagnostic Lab', icon: 'FlaskConical', description: 'At-home sample collection', color: 'secondary', estimatedResponseTime: '1-2 hours' },
  { id: 'ambulance', label: 'Ambulance', icon: 'Ambulance', description: 'Emergency medical transport', color: 'primary', estimatedResponseTime: '5-10 mins' },
  { id: 'transport', label: 'Transportation', icon: 'Car', description: 'Safe rides to appointments', color: 'secondary', estimatedResponseTime: '15-20 mins' },
  { id: 'electrician', label: 'Electrician', icon: 'Zap', description: 'Electrical repairs & safety check', color: 'primary', estimatedResponseTime: '30-45 mins' },
  { id: 'plumber', label: 'Plumber', icon: 'Wrench', description: 'Plumbing repairs & maintenance', color: 'secondary', estimatedResponseTime: '30-45 mins' },
  { id: 'housekeeping', label: 'Housekeeping', icon: 'Home', description: 'Cleaning & household management', color: 'primary', estimatedResponseTime: '1-2 hours' },
  { id: 'physiotherapy', label: 'Physiotherapy', icon: 'Activity', description: 'Rehabilitation & physical therapy', color: 'secondary', estimatedResponseTime: '45-60 mins' },
  { id: 'other', label: 'Other', icon: 'HandHeart', description: 'Custom care & special assistance', color: 'primary', estimatedResponseTime: '20-30 mins' },
];

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'mem_1', familyId: 'fam_1', name: 'Mohammed Rahman', relationship: 'Father',
    gender: 'male', dateOfBirth: '1948-05-14', bloodGroup: 'B+',
    medicalConditions: ['Hypertension', 'Type 2 Diabetes'], allergies: ['Penicillin'],
    insurance: { provider: 'Daman Health', policyNumber: 'DH-12345678' },
    emergencyContacts: [{ name: 'Aisha Rahman', relationship: 'Daughter', phone: '+971 50 123 4567', isPrimary: true }],
    status: 'active', medicalNotes: 'Takes insulin daily. Blood pressure monitored weekly.',
    governmentIdType: 'passport', governmentIdNumber: 'A12345678',
    createdAt: daysAgo(90), updatedAt: daysAgo(2),
  },
  {
    id: 'mem_2', familyId: 'fam_1', name: 'Fatima Rahman', relationship: 'Mother',
    gender: 'female', dateOfBirth: '1952-11-03', bloodGroup: 'A+',
    medicalConditions: ['Arthritis', 'Osteoporosis'], allergies: ['Aspirin', 'Latex'],
    insurance: { provider: 'Daman Health', policyNumber: 'DH-87654321' },
    emergencyContacts: [{ name: 'Aisha Rahman', relationship: 'Daughter', phone: '+971 50 123 4567', isPrimary: true }],
    status: 'active', medicalNotes: 'Physiotherapy sessions twice a week.',
    createdAt: daysAgo(88), updatedAt: daysAgo(5),
  },
  {
    id: 'mem_3', familyId: 'fam_1', name: 'Omar Rahman', relationship: 'Brother',
    gender: 'male', dateOfBirth: '1985-08-22', bloodGroup: 'O+',
    medicalConditions: [], allergies: [],
    insurance: { provider: 'AXA Gulf' },
    emergencyContacts: [],
    status: 'active',
    createdAt: daysAgo(60), updatedAt: daysAgo(10),
  },
];

export const mockFamilies: Family[] = [
  {
    id: 'fam_1', userId: 'user_family_1', name: 'Rahman Family',
    primaryContactName: 'Aisha Rahman',
    contact: { phone: '+971 50 123 4567', email: 'aisha.family@example.com' },
    address: { line1: 'Marina Heights, Apt 1203', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'United Arab Emirates' },
    members: mockFamilyMembers,
    emergencyContacts: [{ name: 'Dr. Khalid (Family Doctor)', relationship: 'Doctor', phone: '+971 4 222 3333' }],
    createdAt: daysAgo(90), updatedAt: daysAgo(1),
  },
];

export const mockCareProviders: CareProvider[] = [
  {
    id: 'prov_1', name: 'Sunrise Home Care', type: 'home-care',
    description: 'Award-winning in-home care for seniors. Certified caregivers, nurses and physiotherapists serving Dubai since 2012.',
    contact: { phone: '+971 4 333 1111', email: 'care@sunrise.ae' },
    address: { line1: 'Jumeirah Street', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
    rating: 4.8, reviewCount: 142, isVerified: true,
    services: ['Personal Care', 'Companionship', 'Medication Reminders', 'Wound Care', 'Physiotherapy'],
    experienceYears: 12, startingPrice: 120, currency: 'AED', distanceKm: 2.4, estimatedArrivalMinutes: 25, availability: 'available',
    employees: [
      { id: 'emp_prov_1', name: 'Layla Al-Nasser', role: 'Senior Nurse', experience: '8 years', rating: 4.9, availability: 'Available today' },
      { id: 'emp_prov_2', name: 'Maria Santos', role: 'Caregiver', experience: '5 years', rating: 4.7, availability: 'Available tomorrow' },
      { id: 'emp_prov_3', name: 'Ahmed Khalil', role: 'Physiotherapist', experience: '6 years', rating: 4.8, availability: 'Available today' },
    ],
    reviews: [
      { id: 'rev_1', reviewerName: 'Sara M.', rating: 5, comment: 'Exceptional care for my father. Layla was patient, professional and kind.', createdAt: daysAgo(10) },
      { id: 'rev_2', reviewerName: 'Khalid A.', rating: 5, comment: 'We have used Sunrise for two years. Best home care in Dubai.', createdAt: daysAgo(20) },
      { id: 'rev_3', reviewerName: 'Nadia R.', rating: 4, comment: 'Reliable and trustworthy. My mother is very comfortable with their team.', createdAt: daysAgo(35) },
    ],
    createdAt: daysAgo(200), updatedAt: daysAgo(1),
  },
  {
    id: 'prov_2', name: 'MedExpress Pharmacy', type: 'pharmacy',
    description: 'Same-day medicine delivery across Dubai and Abu Dhabi. Prescription management and automated refills.',
    contact: { phone: '+971 4 444 2222', email: 'orders@medexpress.ae' },
    address: { line1: 'Business Bay', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
    rating: 4.6, reviewCount: 389, isVerified: true,
    services: ['Prescription Delivery', 'OTC Medications', 'Medical Supplies', 'Refill Reminders'],
    experienceYears: 7, startingPrice: 0, currency: 'AED', distanceKm: 3.8, estimatedArrivalMinutes: 45, availability: 'available',
    reviews: [
      { id: 'rev_4', reviewerName: 'Hana K.', rating: 5, comment: 'Delivered within 40 minutes. Excellent service.', createdAt: daysAgo(5) },
    ],
    createdAt: daysAgo(150), updatedAt: daysAgo(3),
  },
  {
    id: 'prov_3', name: 'LifeLab Diagnostics', type: 'laboratory',
    description: 'CAP-accredited laboratory with home sample collection. Results within 24 hours.',
    contact: { phone: '+971 4 555 3333', email: 'labs@lifelab.ae' },
    address: { line1: 'Healthcare City', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
    rating: 4.9, reviewCount: 213, isVerified: true,
    services: ['Blood Tests', 'Urine Analysis', 'ECG', 'Home Collection', 'Radiology'],
    experienceYears: 9, startingPrice: 80, currency: 'AED', distanceKm: 5.1, estimatedArrivalMinutes: 60, availability: 'available',
    reviews: [
      { id: 'rev_5', reviewerName: 'Tariq B.', rating: 5, comment: 'Results were accurate and on time. Technician was very professional.', createdAt: daysAgo(8) },
    ],
    createdAt: daysAgo(180), updatedAt: daysAgo(2),
  },
  {
    id: 'prov_4', name: 'CityPhysio & Rehab', type: 'physiotherapy',
    description: 'Specialized physiotherapy and rehabilitation for seniors, post-surgery recovery and chronic conditions.',
    contact: { phone: '+971 4 666 4444', email: 'rehab@cityphysio.ae' },
    address: { line1: 'Al Barsha', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
    rating: 4.7, reviewCount: 95, isVerified: true,
    services: ['Physiotherapy', 'Post-Surgery Rehab', 'Geriatric Care', 'Pain Management'],
    experienceYears: 5, startingPrice: 200, currency: 'AED', distanceKm: 4.2, estimatedArrivalMinutes: 40, availability: 'busy',
    reviews: [],
    createdAt: daysAgo(120), updatedAt: daysAgo(4),
  },
  {
    id: 'prov_5', name: 'RapidDoc', type: 'doctor',
    description: 'Board-certified physicians available 24/7 for home visits. GP, specialist and geriatric consultations.',
    contact: { phone: '+971 4 777 5555', email: 'doc@rapiddoc.ae' },
    address: { line1: 'Downtown Dubai', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
    rating: 4.8, reviewCount: 504, isVerified: true,
    services: ['GP Consultation', 'Specialist Referral', 'Chronic Disease Management', 'Geriatric Care'],
    experienceYears: 15, startingPrice: 350, currency: 'AED', distanceKm: 1.9, estimatedArrivalMinutes: 20, availability: 'available',
    employees: [
      { id: 'emp_prov_4', name: 'Dr. Amira Hassan', role: 'General Practitioner', experience: '12 years', rating: 4.9, availability: 'Available now' },
      { id: 'emp_prov_5', name: 'Dr. Faisal Qureshi', role: 'Geriatrician', experience: '18 years', rating: 4.8, availability: 'Available today' },
    ],
    reviews: [
      { id: 'rev_6', reviewerName: 'Yusra L.', rating: 5, comment: 'Dr. Amira is wonderful with elderly patients. Thorough and caring.', createdAt: daysAgo(3) },
    ],
    createdAt: daysAgo(365), updatedAt: now(),
  },
];

export const mockCareRequests: CareRequest[] = [
  {
    id: 'cr_1', familyId: 'fam_1', memberId: 'mem_1', providerId: 'prov_1',
    category: 'home-nurse', status: 'completed',
    scheduledAt: daysAgo(3), notes: 'Post-surgery wound care check.',
    estimatedCost: 200, currency: 'AED',
    createdAt: daysAgo(5), updatedAt: daysAgo(3),
  },
  {
    id: 'cr_2', familyId: 'fam_1', memberId: 'mem_2', providerId: 'prov_4',
    category: 'physiotherapy', status: 'in_progress',
    scheduledAt: now(), notes: 'Arthritis physiotherapy session.',
    estimatedCost: 250, currency: 'AED',
    createdAt: daysAgo(1), updatedAt: hoursAgo(2),
  },
  {
    id: 'cr_3', familyId: 'fam_1', memberId: 'mem_1', providerId: 'prov_5',
    category: 'doctor', status: 'accepted',
    scheduledAt: daysFromNow(1), notes: 'Monthly diabetes review.',
    estimatedCost: 350, currency: 'AED',
    createdAt: hoursAgo(5), updatedAt: hoursAgo(4),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt_1', familyId: 'fam_1', memberId: 'mem_1', providerId: 'prov_5',
    providerName: 'RapidDoc — Dr. Amira Hassan', serviceType: 'Doctor Consultation',
    scheduledAt: daysFromNow(1), durationMinutes: 30, status: 'upcoming',
    notes: 'Monthly diabetes check', location: 'Home visit',
    createdAt: hoursAgo(5), updatedAt: hoursAgo(4),
  },
  {
    id: 'apt_2', familyId: 'fam_1', memberId: 'mem_2', providerId: 'prov_4',
    providerName: 'CityPhysio & Rehab', serviceType: 'Physiotherapy',
    scheduledAt: daysFromNow(3), durationMinutes: 60, status: 'upcoming',
    notes: 'Arthritis session', location: 'Al Barsha clinic',
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
  },
  {
    id: 'apt_3', familyId: 'fam_1', memberId: 'mem_1', providerId: 'prov_3',
    providerName: 'LifeLab Diagnostics', serviceType: 'Blood Test',
    scheduledAt: daysAgo(7), durationMinutes: 15, status: 'completed',
    notes: 'HbA1c and full blood count', location: 'Home collection',
    createdAt: daysAgo(10), updatedAt: daysAgo(7),
  },
];

export const mockTimeline: TimelineEntry[] = [
  { id: 'tl_1', familyId: 'fam_1', memberId: 'mem_1', eventType: 'care-request-submitted', title: 'Care Request Submitted', description: 'Doctor consultation for Mohammed requested.', createdAt: hoursAgo(5), updatedAt: hoursAgo(5) },
  { id: 'tl_2', familyId: 'fam_1', memberId: 'mem_1', eventType: 'care-request-accepted', title: 'Request Accepted', description: 'RapidDoc accepted the care request.', createdAt: hoursAgo(4), updatedAt: hoursAgo(4) },
  { id: 'tl_3', familyId: 'fam_1', memberId: 'mem_2', eventType: 'care-request-completed', title: 'Physiotherapy Completed', description: 'CityPhysio session for Fatima completed successfully.', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'tl_4', familyId: 'fam_1', memberId: 'mem_1', eventType: 'lab-test', title: 'Lab Results Ready', description: 'HbA1c and CBC results available for Mohammed.', createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 'tl_5', familyId: 'fam_1', memberId: 'mem_1', eventType: 'medicine-delivered', title: 'Medication Delivered', description: 'Monthly insulin supply delivered via MedExpress.', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 'tl_6', familyId: 'fam_1', memberId: 'mem_1', eventType: 'doctor-consultation', title: 'Doctor Consultation', description: 'Dr. Amira Hassan completed monthly diabetes review.', createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 'tl_7', familyId: 'fam_1', memberId: 'mem_2', eventType: 'appointment-scheduled', title: 'Appointment Scheduled', description: 'Physiotherapy at CityPhysio booked for Fatima.', createdAt: daysAgo(32), updatedAt: daysAgo(32) },
  { id: 'tl_8', familyId: 'fam_1', eventType: 'member-added', title: 'Family Member Added', description: 'Omar Rahman added to the family.', createdAt: daysAgo(60), updatedAt: daysAgo(60) },
];

export const mockNotifications: Notification[] = [
  { id: 'notif_1', userId: 'user_family_1', title: 'Care Request Accepted', message: 'RapidDoc has accepted your care request for Mohammed. Dr. Amira will arrive tomorrow.', read: false, type: 'success', createdAt: hoursAgo(4), updatedAt: hoursAgo(4) },
  { id: 'notif_2', userId: 'user_family_1', title: 'Appointment Tomorrow', message: 'Reminder: Doctor consultation for Mohammed Rahman is scheduled for tomorrow at 10:00 AM.', read: false, type: 'info', createdAt: hoursAgo(2), updatedAt: hoursAgo(2) },
  { id: 'notif_3', userId: 'user_family_1', title: 'Physiotherapy In Progress', message: 'CityPhysio session for Fatima Rahman is currently in progress.', read: true, type: 'info', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'notif_4', userId: 'user_family_1', title: 'Lab Results Ready', message: 'HbA1c and CBC results for Mohammed are now available. Please review.', read: true, type: 'warning', createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 'notif_5', userId: 'user_family_1', title: 'Medicine Delivered', message: 'Monthly insulin supply has been delivered by MedExpress Pharmacy.', read: true, type: 'success', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 'notif_6', userId: 'user_family_1', title: 'Care Request Completed', message: 'Home nursing visit for Mohammed by Sunrise Home Care has been completed.', read: true, type: 'success', createdAt: daysAgo(3), updatedAt: daysAgo(3) },
];

export const mockEmployees: Employee[] = [
  { id: 'emp_1', name: 'Layla Al-Nasser', role: 'Registered Nurse', providerId: 'prov_1', contact: { phone: '+971 50 555 1212' }, specialization: ['geriatric-care', 'wound-care'], createdAt: now(), updatedAt: now() },
];

export const mockBookings: Booking[] = [
  { id: 'book_1', familyId: 'fam_1', providerId: 'prov_1', serviceType: 'home-care', scheduledAt: now(), status: 'completed', employeeId: 'emp_1', createdAt: daysAgo(5), updatedAt: daysAgo(3) },
];

export const mockEmergencies: Emergency[] = [];
export const mockMedicalRecords: any[] = [];
