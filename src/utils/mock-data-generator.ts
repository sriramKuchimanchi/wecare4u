import type {
  Family, FamilyMember, CareProvider, CareRequest, Employee, Notification, TimelineEntry, ProviderReview, ProviderDocument, CareCategory
} from '@/types';
import {
  mockFamilies as seedFamilies,
  mockCareProviders as seedProviders,
  mockEmployees as seedEmployees,
  mockCareRequests as seedRequests,
  mockNotifications as seedNotifications,
  mockTimeline as seedTimeline,
  mockServiceCategories as seedCategories,
  mockAdminDocuments as seedDocuments,
  mockAdminReviews as seedReviews,
} from './mock-data';

const firstNamesMale = ['Ramachandra', 'Rajesh', 'Amit', 'Vikram', 'Suresh', 'Alok', 'Devendra', 'Rajesh', 'Dinesh', 'Venkatesh', 'Srinivas', 'Dilip', 'Arun', 'Ramesh', 'Vijay', 'Sunil', 'Kishore', 'Prakash', 'Mahesh', 'Ganesh', 'Subhash', 'Ashok', 'Deepak', 'Manoj', 'Anand', 'Sanjay', 'Mukesh', 'Nilesh', 'Pradeep', 'Sandeep'];
const firstNamesFemale = ['Savitri', 'Anjali', 'Ritu', 'Sunita', 'Meenakshi', 'Padmavathi', 'Kantaben', 'Priya', 'Kavita', 'Sneha', 'Radhika', 'Kirti', 'Pooja', 'Shoba', 'Lakshmi', 'Venkamma', 'Vandana', 'Saroj', 'Asha', 'Reena', 'Geeta', 'Nirmala', 'Suman', 'Lata', 'Pushpa', 'Usha', 'Saraswati', 'Durga', 'Anita', 'Sunita'];
const lastNames = ['Sharma', 'Verma', 'Kumar', 'Gupta', 'Patel', 'Nair', 'Iyer', 'Reddy', 'Mehta', 'Joshi', 'Pillai', 'Singh', 'Deshmukh', 'Kulkarni', 'Bhat', 'Rao', 'Chowdhury', 'Mukherjee', 'Banerjee', 'Naidu', 'Sethi', 'Malhotra', 'Kapoor', 'Khanna', 'Agarwal', 'Shah', 'Trivedi', 'Pandey', 'Mishra', 'Tripathi'];

const cities = [
  { city: 'Mumbai', state: 'Maharashtra', pinBase: '4000' },
  { city: 'Thane', state: 'Maharashtra', pinBase: '4006' },
  { city: 'Navi Mumbai', state: 'Maharashtra', pinBase: '4007' },
  { city: 'Pune', state: 'Maharashtra', pinBase: '4110' },
  { city: 'Delhi', state: 'Delhi', pinBase: '1100' },
  { city: 'Bangalore', state: 'Karnataka', pinBase: '5600' },
];

const medicalConditionsList = [
  'Hypertension', 'Type 2 Diabetes', 'Arthritis', 'Osteoporosis', 'Heart Disease', 'Dementia',
  'Parkinson\'s Disease', 'Post-Stroke Hemiplegia', 'Chronic Kidney Disease', 'Asthma', 'COPD', 'Cataract'
];

const allergiesList = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Latex', 'Dust mites', 'NSAIDs', 'Pollen', 'Shellfish'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export function generateExpandedDatabase() {
  // 1. Families (50+) & Family Members (200+)
  const families: Family[] = [...seedFamilies];
  const allMembers: FamilyMember[] = [...seedFamilies[0].members];

  for (let i = 2; i <= 55; i++) {
    const lastName = randomItem(lastNames);
    const maleContact = `${randomItem(firstNamesMale)} ${lastName}`;
    const location = randomItem(cities);
    const pin = `${location.pinBase}${randomNumber(10, 99)}`;
    const familyId = `fam_${i}`;
    const memberCount = randomNumber(3, 5);
    const members: FamilyMember[] = [];

    for (let m = 1; m <= memberCount; m++) {
      const isFemale = m % 2 === 0;
      const firstName = isFemale ? randomItem(firstNamesFemale) : randomItem(firstNamesMale);
      const memberName = `${firstName} ${lastName}`;
      const rel = m === 1 ? 'Father' : m === 2 ? 'Mother' : m === 3 ? 'Spouse' : m === 4 ? 'Son' : 'Daughter';
      const age = m <= 2 ? randomNumber(68, 88) : randomNumber(30, 50);
      const birthYear = 2026 - age;

      const mem: FamilyMember = {
        id: `mem_${i}_${m}`,
        familyId,
        name: memberName,
        relationship: rel,
        gender: isFemale ? 'female' : 'male',
        dateOfBirth: `${birthYear}-0${randomNumber(1, 9)}-${randomNumber(10, 28)}`,
        bloodGroup: randomItem(bloodGroups) as any,
        medicalConditions: randomItems(medicalConditionsList, randomNumber(1, 3)),
        allergies: randomItems(allergiesList, randomNumber(0, 2)),
        status: 'active',
        governmentIdType: 'aadhaar',
        governmentIdNumber: `${randomNumber(1000, 9999)}-${randomNumber(1000, 9999)}-${randomNumber(1000, 9999)}`,
        createdAt: daysAgo(randomNumber(10, 300)),
        updatedAt: daysAgo(randomNumber(1, 10)),
      };
      members.push(mem);
      allMembers.push(mem);
    }

    families.push({
      id: familyId,
      userId: `user_family_${i}`,
      name: `${lastName} Family`,
      primaryContactName: maleContact,
      contact: { phone: `+91 98${randomNumber(100, 999)} ${randomNumber(10000, 99999)}`, email: `${maleContact.toLowerCase().replace(/\s+/g, '.')}@example.com` },
      address: { line1: `Sector ${randomNumber(1, 25)}, Flat ${randomNumber(101, 909)}`, city: location.city, state: location.state, postalCode: pin, country: 'India' },
      members,
      emergencyContacts: [{ name: maleContact, relationship: 'Primary Contact', phone: `+91 98${randomNumber(100, 999)} ${randomNumber(10000, 99999)}`, isPrimary: true }],
      createdAt: daysAgo(randomNumber(10, 300)),
      updatedAt: daysAgo(randomNumber(1, 10)),
    });
  }

  // 2. Service Providers (40+)
  const providers: CareProvider[] = [...seedProviders];
  const providerTypes: CareProvider['type'][] = ['home-care', 'nursing', 'physiotherapy', 'pharmacy', 'laboratory', 'transport', 'medical-visit', 'doctor', 'hospital', 'caregiver'];

  for (let p = 6; p <= 45; p++) {
    const lastName = randomItem(lastNames);
    const location = randomItem(cities);
    const pin = `${location.pinBase}${randomNumber(10, 99)}`;
    const type = randomItem(providerTypes);
    const name = `${lastName} ${type.split('-').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ')} Care Center`;

    providers.push({
      id: `prov_${p}`,
      name,
      type,
      description: `Leading provider of ${type} services in ${location.city}. Certified professionals available 24/7.`,
      contact: { phone: `+91 22 ${randomNumber(4000, 4999)} ${randomNumber(1000, 9999)}`, email: `care@${name.toLowerCase().replace(/[^a-z]/g, '')}.in` },
      address: { line1: `Main Road, Block ${randomNumber(1, 12)}`, city: location.city, state: location.state, postalCode: pin, country: 'India' },
      rating: Number((4 + Math.random() * 0.95).toFixed(2)),
      reviewCount: randomNumber(25, 450),
      isVerified: p % 5 !== 0,
      services: ['Home Visit', 'Emergency Dispatch', 'Sample Pickup', 'Nursing Care'],
      experienceYears: randomNumber(3, 20),
      startingPrice: randomNumber(500, 3000),
      currency: '₹',
      distanceKm: Number((1 + Math.random() * 8).toFixed(1)),
      estimatedArrivalMinutes: randomNumber(15, 45),
      availability: p % 4 === 0 ? 'busy' : 'available',
      createdAt: daysAgo(randomNumber(50, 400)),
      updatedAt: daysAgo(randomNumber(1, 5)),
    });
  }

  // 3. Employees (300+)
  const employees: Employee[] = [...seedEmployees];
  const roles = [
    { role: 'Senior Registered Nurse', dept: 'Home Nursing', licPrefix: 'INC-RN' },
    { role: 'Elderly Caregiver', dept: 'Geriatric Support', licPrefix: 'CG' },
    { role: 'Senior Physiotherapist', dept: 'Rehabilitation', licPrefix: 'BPT' },
    { role: 'General Physician', dept: 'Medical Consultations', licPrefix: 'MCI-MD' },
    { role: 'Emergency Medical Technician', dept: 'Ambulance Response', licPrefix: 'EMT' },
    { role: 'Lab Technician', dept: 'Diagnostics', licPrefix: 'DMLT' },
    { role: 'Pharmacist Assistant', dept: 'Pharmacy Delivery', licPrefix: 'PHARM' },
  ];

  for (let e = 8; e <= 310; e++) {
    const isFemale = e % 2 === 0;
    const firstName = isFemale ? randomItem(firstNamesFemale) : randomItem(firstNamesMale);
    const lastName = randomItem(lastNames);
    const empName = `${firstName} ${lastName}`;
    const roleInfo = randomItem(roles);
    const prov = randomItem(providers);

    employees.push({
      id: `emp_${e}`,
      name: empName,
      role: roleInfo.role,
      department: roleInfo.dept,
      experience: `${randomNumber(2, 18)} years`,
      licenseNumber: `${roleInfo.licPrefix}-${randomNumber(10000, 99999)}-MUM`,
      providerId: prov.id,
      contact: { phone: `+91 98${randomNumber(100, 999)} ${randomNumber(10000, 99999)}`, email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${prov.name.toLowerCase().replace(/[^a-z]/g, '')}.in` },
      address: { line1: `Suburbs Sector ${randomNumber(1, 15)}`, city: prov.address.city, state: prov.address.state, postalCode: prov.address.postalCode, country: 'India' },
      languages: ['Hindi', 'English', 'Marathi'],
      availability: e % 5 === 0 ? 'busy' : e % 12 === 0 ? 'emergency_duty' : 'available',
      status: 'active',
      rating: Number((4.2 + Math.random() * 0.75).toFixed(2)),
      reviewCount: randomNumber(10, 120),
      assignedRequestsCount: randomNumber(0, 3),
      completedRequestsCount: randomNumber(20, 200),
      specialization: [roleInfo.dept, 'Elderly Health'],
      createdAt: daysAgo(randomNumber(30, 365)),
      updatedAt: daysAgo(randomNumber(1, 3)),
    });
  }

  // 4. Care Requests (500+)
  const requests: CareRequest[] = [...seedRequests];
  const categoriesList = ['home-nurse', 'doctor', 'physiotherapy', 'caregiver', 'laboratory', 'medicine', 'ambulance', 'transport'];
  const statuses: CareRequest['status'][] = ['pending', 'accepted', 'employee_assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'];
  const priorities: CareRequest['priority'][] = ['standard', 'urgent', 'scheduled', 'emergency'];

  for (let r = 106; r <= 520; r++) {
    const fam = randomItem(families);
    const mem = randomItem(fam.members) ?? fam.members[0];
    const prov = randomItem(providers);
    const emp = randomItem(employees.filter(e => e.providerId === prov.id) ?? employees);
    const cat = randomItem(categoriesList);
    const status = randomItem(statuses);
    const priority = randomItem(priorities);

    requests.push({
      id: `req_${r}`,
      familyId: fam.id,
      familyName: fam.name,
      memberId: mem?.id,
      patientName: mem?.name ?? fam.primaryContactName,
      providerId: prov.id,
      providerName: prov.name,
      employeeId: emp?.id,
      employeeName: emp?.name,
      employeeRole: emp?.role,
      employeePhone: emp?.contact.phone,
      category: cat,
      categoryLabel: cat.split('-').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' '),
      priority,
      status,
      scheduledAt: daysAgo(randomNumber(-5, 30)),
      notes: `Care assistance requested for ${mem?.name ?? 'patient'}. Medical notes reviewed.`,
      medicalNotes: mem?.medicalConditions?.join(', ') || 'General health evaluation required.',
      address: fam.address,
      estimatedCost: randomNumber(800, 3500),
      currency: '₹',
      estimatedArrivalMinutes: randomNumber(10, 45),
      createdAt: daysAgo(randomNumber(1, 60)),
      updatedAt: daysAgo(randomNumber(0, 10)),
    });
  }

  // 5. Notifications (2000+) & Timeline Events (3000+)
  const notifications: Notification[] = [...seedNotifications];
  const timeline: TimelineEntry[] = [...seedTimeline];

  for (let n = 11; n <= 2000; n++) {
    const fam = randomItem(families);
    notifications.push({
      id: `notif_${n}`,
      userId: fam.userId,
      title: randomItem(['Care Request Update', 'Doctor Appointment Confirmed', 'Medicine Shipment Dispatched', 'Vitals Assessment Complete', 'Emergency Dispatch Status']),
      message: `System notification regarding care services for ${fam.name}.`,
      read: n % 3 === 0,
      type: n % 5 === 0 ? 'warning' : n % 8 === 0 ? 'error' : 'success',
      createdAt: daysAgo(randomNumber(0, 40)),
      updatedAt: daysAgo(randomNumber(0, 10)),
    });
  }

  for (let t = 6; t <= 3000; t++) {
    const fam = randomItem(families);
    const mem = randomItem(fam.members) ?? fam.members[0];
    timeline.push({
      id: `tl_${t}`,
      familyId: fam.id,
      memberId: mem?.id,
      eventType: randomItem(['care-request-submitted', 'care-request-accepted', 'care-request-completed', 'lab-test', 'medicine-delivered', 'doctor-consultation']),
      title: `Care Activity — ${mem?.name}`,
      description: `Service event recorded for ${mem?.name} under ${fam.name}.`,
      createdAt: daysAgo(randomNumber(0, 90)),
      updatedAt: daysAgo(randomNumber(0, 10)),
    });
  }

  // 6. Emergency Sessions (15 seeded)
  const emergencyStepTemplates = [
    { step: 'sos_triggered', title: 'SOS Triggered', description: 'Emergency SOS has been activated.', status: 'completed' },
    { step: 'location_detected', title: 'GPS Received', description: 'Location pinpointed via device GPS.', status: 'completed' },
    { step: 'coordinator_activated', title: 'AI Coordinator Activated', description: 'AI coordinator finding nearest available service provider.', status: 'completed' },
    { step: 'provider_found', title: 'Provider Assigned', description: 'Nearest service provider located and dispatched.', status: 'completed' },
    { step: 'professional_assigned', title: 'Employee Assigned', description: 'Emergency medical professional assigned.', status: 'completed' },
    { step: 'ambulance_assigned', title: 'Ambulance Dispatched', description: 'Ambulance is en route to the location.', status: 'completed' },
    { step: 'hospital_notified', title: 'Hospital Notified', description: 'Nearest hospital alerted, preparing for patient.', status: 'completed' },
    { step: 'contacts_notified', title: 'Medicine Arranged', description: 'Emergency medicines arranged with hospital.', status: 'completed' },
    { step: 'resolved', title: 'Emergency Resolved', description: 'Patient stable. Emergency resolved.', status: 'completed' },
  ];

  const emergencies: any[] = [];
  for (let em = 1; em <= 15; em++) {
    const fam = randomItem(families);
    const mem = randomItem(fam.members) ?? fam.members[0];
    const prov = randomItem(providers);
    const emp = randomItem(employees.filter(e => e.providerId === prov.id) ?? employees);
    const isActive = em <= 3;
    const stepsCompleted = isActive ? randomNumber(1, 5) : 9;

    emergencies.push({
      id: `emergency_${em}`,
      familyId: fam.id,
      memberId: mem?.id,
      memberName: mem?.name ?? fam.primaryContactName,
      status: isActive ? 'active' : 'resolved',
      currentStepIndex: stepsCompleted - 1,
      location: { ...fam.address, lat: 19.07 + Math.random() * 0.2, lng: 72.87 + Math.random() * 0.2 },
      assignedProvider: { id: prov.id, name: prov.name, phone: prov.contact.phone, etaMinutes: randomNumber(5, 15) },
      assignedProfessional: emp ? { id: emp.id, name: emp.name, role: emp.role, phone: emp.contact.phone } : undefined,
      assignedAmbulance: { vehicleNumber: `MH-02-AB-${1000 + em}`, driverName: `${randomItem(firstNamesMale)} ${randomItem(lastNames)}`, phone: `+91 98${randomNumber(100, 999)} ${randomNumber(10000, 99999)}`, etaMinutes: randomNumber(5, 12) },
      notifiedHospital: { name: randomItem(['Kokilaben Dhirubhai Ambani Hospital', 'Lilavati Hospital', 'Breach Candy Hospital', 'Jupiter Hospital', 'Fortis Hiranandani Hospital']), phone: `+91 22 ${randomNumber(3000, 4999)} ${randomNumber(1000, 9999)}`, address: `${randomItem(cities).city}, Maharashtra` },
      notifiedContactsCount: randomNumber(1, 3),
      steps: emergencyStepTemplates.map((s, i) => ({
        ...s,
        status: i < stepsCompleted ? 'completed' : i === stepsCompleted ? 'in-progress' : 'pending',
        completedAt: i < stepsCompleted ? daysAgo(randomNumber(0, 5)) : undefined,
      })),
      createdAt: daysAgo(randomNumber(0, 30)),
      updatedAt: daysAgo(randomNumber(0, 3)),
    });
  }

  return {
    families,
    members: allMembers,
    providers,
    employees,
    requests,
    notifications,
    timeline,
    documents: seedDocuments,
    reviews: seedReviews,
    categories: seedCategories,
    emergencies,
  };
}
