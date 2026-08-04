/**
 * Central Data Repository — Single Source of Truth
 *
 * All services read and write from this in-memory store.
 * TanStack Query automatically fetches from here, so any mutation
 * to this store + calling invalidateAllPortals() causes every portal
 * to re-render with fresh data.
 *
 * This is the integration backbone of the We Care For You platform.
 */

import type {
  Family, FamilyMember, CareProvider, Employee, CareRequest, CareRequestStatus, Notification, TimelineEntry,
  EmergencySession, Appointment, MedicalRecord, MedicationReminder,
} from '@/types';
import { generateExpandedDatabase } from '@/utils/mock-data-generator';
import { eventBus } from '@/lib/event-bus';
import { createId, nowISO } from '@/lib/mock-api';

// Lazy-initialized database — generated once on first access
let _db: ReturnType<typeof generateExpandedDatabase> | null = null;

function getDb() {
  if (!_db) {
    _db = generateExpandedDatabase();
  }
  return _db;
}

// ─── Emit helpers ────────────────────────────────────────────────────────────

function emitChange(event: string, data?: any) {
  setTimeout(() => {
    eventBus.emit(event, data);
    eventBus.invalidateAllPortals();
  }, 0);
}

// ─── Notification helpers ──────────────────────────────────────────────────

function addNotification(userId: string, title: string, message: string, type: Notification['type'] = 'info', link?: string) {
  const db = getDb();
  const notif: Notification = {
    id: createId('notif'),
    userId,
    title,
    message,
    read: false,
    type,
    link,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  db.notifications.unshift(notif);
  return notif;
}

function addTimelineEvent(
  familyId: string,
  eventType: TimelineEntry['eventType'],
  title: string,
  description: string,
  memberId?: string
) {
  const db = getDb();
  const entry: TimelineEntry = {
    id: createId('tl'),
    familyId,
    memberId,
    eventType,
    title,
    description,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  db.timeline.unshift(entry);
  return entry;
}

// ─── FAMILIES ───────────────────────────────────────────────────────────────

export const familyRepository = {
  getAll(filters?: { search?: string; status?: string; page?: number; pageSize?: number }) {
    const db = getDb();
    let result = [...db.families];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.primaryContactName.toLowerCase().includes(q) ||
          f.contact.email?.toLowerCase().includes(q) ||
          f.address.city.toLowerCase().includes(q)
      );
    }
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 50;
    const data = result.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  getById(id: string) {
    const db = getDb();
    const family = db.families.find((f) => f.id === id);
    if (!family) return null;

    // Attach care requests and emergencies
    const careRequests = db.requests.filter((r) => r.familyId === id);
    const emergencies = db.emergencies?.filter((e: EmergencySession) => e.familyId === id) ?? [];
    return { ...family, careRequests, emergencies };
  },

  getByUserId(userId: string) {
    const db = getDb();
    return db.families.find((f) => f.userId === userId) ?? null;
  },

  updateStatus(id: string, status: string) {
    const db = getDb();
    const family = db.families.find((f) => f.id === id);
    if (family) {
      (family as any).status = status;
      family.updatedAt = nowISO();
      emitChange('family:updated', { id, status });
    }
  },

  updateMember(familyId: string, memberId: string, patch: any) {
    const db = getDb();
    const family = db.families.find((f) => f.id === familyId);
    if (family && family.members) {
      const idx = family.members.findIndex((m) => m.id === memberId);
      if (idx !== -1) {
        family.members[idx] = { ...family.members[idx], ...patch, updatedAt: nowISO() };
        family.updatedAt = nowISO();
        emitChange('family:updated', { id: familyId, memberId });
        return family.members[idx];
      }
    }
    return null;
  },
};

// ─── SERVICE PROVIDERS ──────────────────────────────────────────────────────

export const providerRepository = {
  getAll(filters?: {
    search?: string;
    verificationStatus?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }) {
    const db = getDb();
    let result = [...db.providers];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.city.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }
    if (filters?.verificationStatus && filters.verificationStatus !== 'all') {
      result = result.filter(
        (p) => ((p as any).verificationStatus ?? (p.isVerified ? 'approved' : 'pending')) === filters.verificationStatus
      );
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter((p) => p.type === filters.type);
    }
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const data = result.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  getById(id: string) {
    const db = getDb();
    const provider = db.providers.find((p) => p.id === id);
    if (!provider) return null;
    const employees = db.employees.filter((e) => e.providerId === id);
    const careRequests = db.requests.filter((r) => r.providerId === id);
    const documents = (db.documents ?? []).filter((d: any) => d.ownerId === id);
    return {
      ...provider,
      employees,
      careRequests,
      documents,
      employeeCount: employees.length,
      activeRequestsCount: careRequests.filter((r) => !['completed', 'cancelled'].includes(r.status)).length,
      totalRequestsCount: careRequests.length,
      documentsCount: documents.length,
      verificationStatus: (provider as any).verificationStatus ?? (provider.isVerified ? 'approved' : 'pending'),
    };
  },

  approve(id: string) {
    const db = getDb();
    const p = db.providers.find((p) => p.id === id);
    if (p) {
      (p as any).verificationStatus = 'approved';
      p.isVerified = true;
      p.updatedAt = nowISO();
      addNotification(`user_provider_${id}`, 'Service Provider Approved ✅', 'Your service provider registration has been approved. You can now accept care requests.', 'success');
      addNotification('user_admin_1', 'Service Provider Approved', `${p.name} has been approved and is now active on the platform.`, 'info');
      emitChange('provider:approved', { id });
    }
  },

  reject(id: string, reason: string) {
    const db = getDb();
    const p = db.providers.find((p) => p.id === id);
    if (p) {
      (p as any).verificationStatus = 'rejected';
      (p as any).rejectionReason = reason;
      p.isVerified = false;
      p.updatedAt = nowISO();
      addNotification(`user_provider_${id}`, 'Provider Registration Rejected', `Your registration has been reviewed: ${reason}`, 'error');
      emitChange('provider:rejected', { id, reason });
    }
  },

  suspend(id: string) {
    const db = getDb();
    const p = db.providers.find((p) => p.id === id);
    if (p) {
      (p as any).verificationStatus = 'suspended';
      p.isVerified = false;
      p.updatedAt = nowISO();
      emitChange('provider:suspended', { id });
    }
  },
};

// ─── EMPLOYEES ───────────────────────────────────────────────────────────────

export const employeeRepository = {
  getAll(filters?: {
    search?: string;
    verificationStatus?: string;
    availability?: string;
    providerId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const db = getDb();
    let result = [...db.employees];
    if (filters?.providerId) {
      result = result.filter((e) => e.providerId === filters.providerId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department?.toLowerCase().includes(q)
      );
    }
    if (filters?.verificationStatus && filters.verificationStatus !== 'all') {
      result = result.filter(
        (e) => ((e as any).verificationStatus ?? 'approved') === filters.verificationStatus
      );
    }
    if (filters?.availability && filters.availability !== 'all') {
      result = result.filter((e) => e.availability === filters.availability);
    }
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 30;
    const data = result.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  getById(id: string) {
    const db = getDb();
    const emp = db.employees.find((e) => e.id === id);
    if (!emp) return null;
    const provider = db.providers.find((p) => p.id === emp.providerId);
    return { ...emp, providerName: provider?.name ?? 'Independent', verificationStatus: (emp as any).verificationStatus ?? 'approved' };
  },

  updateAvailability(id: string, availability: Employee['availability']) {
    const db = getDb();
    const emp = db.employees.find((e) => e.id === id);
    if (emp) {
      emp.availability = availability;
      emp.updatedAt = nowISO();
      emitChange('employee:availability_updated', { id, availability });
    }
  },

  approve(id: string) {
    const db = getDb();
    const emp = db.employees.find((e) => e.id === id);
    if (emp) {
      (emp as any).verificationStatus = 'approved';
      emp.updatedAt = nowISO();
      addNotification(`user_employee_${id}`, 'Employee Verified ✅', 'Your profile has been verified. You are now active on the platform.', 'success');
      emitChange('employee:approved', { id });
    }
  },

  suspend(id: string) {
    const db = getDb();
    const emp = db.employees.find((e) => e.id === id);
    if (emp) {
      (emp as any).verificationStatus = 'suspended';
      emp.status = 'inactive';
      emp.updatedAt = nowISO();
      emitChange('employee:suspended', { id });
    }
  },
};

// ─── CARE REQUESTS ───────────────────────────────────────────────────────────

export const careRequestRepository = {
  getAll(filters?: {
    search?: string;
    status?: string;
    priority?: string;
    providerId?: string;
    employeeId?: string;
    familyId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const db = getDb();
    let result = [...db.requests];
    if (filters?.familyId) result = result.filter((r) => r.familyId === filters.familyId);
    if (filters?.providerId) result = result.filter((r) => r.providerId === filters.providerId);
    if (filters?.employeeId) result = result.filter((r) => r.employeeId === filters.employeeId);
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'emergency') {
        result = result.filter((r) => r.priority === 'emergency');
      } else {
        result = result.filter((r) => r.status === filters.status);
      }
    }
    if (filters?.priority && filters.priority !== 'all') {
      // Group priorities: treat 'urgent' as part of 'emergency' and 'scheduled' as part of 'standard'
      if (filters.priority === 'emergency') {
        result = result.filter((r) => r.priority === 'emergency' || r.priority === 'urgent');
      } else if (filters.priority === 'standard') {
        result = result.filter((r) => r.priority === 'standard' || r.priority === 'scheduled');
      } else {
        result = result.filter((r) => r.priority === filters.priority);
      }
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.patientName?.toLowerCase().includes(q) ||
          r.familyName?.toLowerCase().includes(q) ||
          r.categoryLabel?.toLowerCase().includes(q) ||
          r.providerName?.toLowerCase().includes(q) ||
          r.employeeName?.toLowerCase().includes(q)
      );
    }
    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const data = result.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  getById(id: string) {
    const db = getDb();
    return db.requests.find((r) => r.id === id) ?? null;
  },

  create(input: Omit<CareRequest, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getDb();
    const req: CareRequest = {
      ...input,
      id: createId('req'),
      status: 'requested',
      createdAt: nowISO(),
      updatedAt: nowISO(),
      timeline: [{ status: 'requested', title: 'Request Submitted', timestamp: nowISO(), description: 'Your care request has been received and is awaiting provider acceptance.' }],
    };
    db.requests.unshift(req);

    // Emit cross-portal events
    addTimelineEvent(input.familyId, 'care-request-submitted', `Care Request — ${req.categoryLabel}`, `A new care request has been submitted for ${req.patientName}.`, req.memberId);
    addNotification(input.familyId, 'Request Submitted', `Your ${req.categoryLabel} request has been submitted. A service provider will confirm shortly.`, 'success');
    addNotification('user_admin_1', 'New Care Request', `${input.familyName} has submitted a ${req.categoryLabel} care request.`, 'info');
    emitChange('care-request:created', { id: req.id });
    return req;
  },

  updateStatus(
    id: string,
    status: CareRequest['status'],
    options?: { note?: string }
  ) {
    const db = getDb();
    const req = db.requests.find((r) => r.id === id);
    if (!req) return null;

    req.status = status;
    req.updatedAt = nowISO();

    const stepTitles: Record<CareRequestStatus, string> = {
      requested: 'Request Submitted',
      accepted: 'Request Accepted',
      on_the_way: 'Professional On The Way',
      arrived: 'Professional Arrived',
      in_progress: 'Service Started',
      completed: 'Service Completed',
      cancelled: 'Request Cancelled',
    };

    const stepDescriptions: Record<CareRequestStatus, string> = {
      requested: 'Your care request has been received and is awaiting provider acceptance.',
      accepted: `${req.providerName} has accepted your care request.`,
      on_the_way: `Your care professional is on the way to your location. ETA: ${req.estimatedArrivalMinutes} minutes.`,
      arrived: 'Your care professional has arrived at your location.',
      in_progress: 'The care service is now in progress.',
      completed: 'Service has been completed successfully.',
      cancelled: options?.note ?? 'The request has been cancelled.',
    };

    if (!req.timeline) req.timeline = [];
    req.timeline.push({
      status,
      title: stepTitles[status] ?? status,
      timestamp: nowISO(),
      description: stepDescriptions[status] ?? options?.note,
    });

    // Cross-portal notifications
    const family = db.families.find((f) => f.id === req.familyId);
    if (family) {
      addNotification(family.userId, stepTitles[status] ?? 'Request Update', stepDescriptions[status] ?? `Your request status has been updated to ${status}.`,
        status === 'completed' ? 'success' : status === 'cancelled' ? 'error' : 'info'
      );
      addTimelineEvent(req.familyId, status === 'completed' ? 'care-request-completed' : 'care-request-accepted', stepTitles[status] ?? 'Care Update', stepDescriptions[status] ?? '', req.memberId);
    }

    // Admin notification
    if (['accepted', 'completed', 'cancelled'].includes(status)) {
      addNotification('user_admin_1', `Request ${stepTitles[status]}`, `Care Request #${req.id} for ${req.patientName} — ${stepTitles[status]}.`, 'info');
    }

    emitChange('care-request:status_updated', { id, status });
    return req;
  },

  addAttachment(id: string, attachment: { name: string; url: string; kind: 'image' | 'document' }) {
    const db = getDb();
    const req = db.requests.find((r) => r.id === id);
    if (!req) return null;

    if (!req.attachments) req.attachments = [];
    req.attachments.push({ id: createId('att'), ...attachment, uploadedAt: nowISO() });
    req.updatedAt = nowISO();

    emitChange('care-request:attachment_added', { id });
    return req;
  },
};

// ─── EMERGENCIES ─────────────────────────────────────────────────────────────

export const emergencyRepository = {
  getAll(filters?: { status?: string; familyId?: string }) {
    const db = getDb();
    let result: EmergencySession[] = [...(db.emergencies ?? [])];
    if (filters?.familyId) result = result.filter((e) => e.familyId === filters.familyId);
    if (filters?.status && filters.status !== 'all') result = result.filter((e) => e.status === filters.status);
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  },

  getById(id: string) {
    const db = getDb();
    return (db.emergencies ?? []).find((e: EmergencySession) => e.id === id) ?? null;
  },

  trigger(familyId: string, memberId: string, memberName: string, location: EmergencySession['location']) {
    const db = getDb();
    if (!db.emergencies) db.emergencies = [];

    const session: EmergencySession = {
      id: createId('emergency'),
      familyId,
      memberId,
      memberName,
      status: 'active',
      currentStepIndex: 0,
      location,
      notifiedContactsCount: 0,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      steps: [
        { step: 'sos_triggered', title: 'SOS Triggered', description: 'Emergency SOS has been activated.', status: 'completed', completedAt: nowISO() },
        { step: 'location_detected', title: 'GPS Received', description: `Location detected: ${location.city}`, status: 'in-progress' },
        { step: 'coordinator_activated', title: 'AI Coordinator Activated', description: 'AI coordinator is finding the nearest available service provider.', status: 'pending' },
        { step: 'provider_found', title: 'Provider Assigned', description: 'Nearest service provider located and dispatched.', status: 'pending' },
        { step: 'professional_assigned', title: 'Employee Assigned', description: 'Emergency medical professional assigned.', status: 'pending' },
        { step: 'ambulance_assigned', title: 'Ambulance Dispatched', description: 'Ambulance is en route to the location.', status: 'pending' },
        { step: 'hospital_notified', title: 'Hospital Notified', description: 'Nearest hospital has been alerted and is preparing for patient arrival.', status: 'pending' },
        { step: 'contacts_notified', title: 'Medicine Arranged', description: 'Emergency medicines and blood type information shared with hospital.', status: 'pending' },
        { step: 'resolved', title: 'Emergency Resolved', description: 'Emergency has been resolved. Patient is stable.', status: 'pending' },
      ],
    };

    db.emergencies.unshift(session);

    // Cross-portal emergency alerts
    const family = db.families.find((f) => f.id === familyId);
    addNotification(family?.userId ?? familyId, '🚨 SOS ACTIVATED', `Emergency SOS has been triggered for ${memberName}. Help is on the way.`, 'error');
    addNotification('user_admin_1', '🚨 CRITICAL — SOS Triggered', `Emergency SOS for ${memberName} (${family?.name ?? familyId}) at ${location.city}. Dispatcher activated.`, 'error');
    addTimelineEvent(familyId, 'emergency-triggered', '🚨 Emergency SOS Triggered', `Emergency SOS triggered for ${memberName} at ${location.city}.`, memberId);

    // Simulate auto-progression within seconds
    const simulate = async () => {
      const steps: Array<{ step: string; providerName?: string; empName?: string }> = [
        { step: 'coordinator_activated' },
        { step: 'provider_found', providerName: 'Nair Emergency Medical Services' },
        { step: 'professional_assigned', empName: 'Dr. Alok Gupta' },
        { step: 'ambulance_assigned' },
        { step: 'hospital_notified' },
        { step: 'contacts_notified' },
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((r) => setTimeout(r, 8000 + i * 6000));
        const current = db.emergencies?.find((e: EmergencySession) => e.id === session.id);
        if (!current || current.status !== 'active') break;
        current.currentStepIndex = i + 1;
        const stepObj = current.steps.find((s: any) => s.step === steps[i].step);
        if (stepObj) {
          stepObj.status = 'completed';
          stepObj.completedAt = nowISO();
          if (steps[i].step === 'provider_found') {
            current.assignedProvider = { id: 'prov_1', name: steps[i].providerName!, phone: '+91 22 4000 1000', etaMinutes: 8 };
          }
          if (steps[i].step === 'professional_assigned') {
            current.assignedProfessional = { id: 'emp_1', name: steps[i].empName!, role: 'Emergency Physician', phone: '+91 98000 12345' };
            current.assignedAmbulance = { vehicleNumber: 'MH-02-AB-1234', driverName: 'Rajan Patil', phone: '+91 98100 55566', etaMinutes: 6 };
            current.notifiedHospital = { name: 'Kokilaben Dhirubhai Ambani Hospital', phone: '+91 22 3099 9999', address: 'Four Bungalows, Andheri West, Mumbai' };
          }
        }
        // Mark next step in-progress
        if (i + 1 < current.steps.length) {
          current.steps[i + 1].status = 'in-progress';
        }
        current.updatedAt = nowISO();
        emitChange('emergency:step_updated', { id: session.id, stepIndex: i + 1 });
      }
    };

    simulate().catch(console.error);
    emitChange('emergency:triggered', { id: session.id });
    return session;
  },

  resolve(id: string) {
    const db = getDb();
    const session = db.emergencies?.find((e: EmergencySession) => e.id === id);
    if (!session) return;
    session.status = 'resolved';
    session.updatedAt = nowISO();
    const lastStep = session.steps.find((s: any) => s.step === 'resolved');
    if (lastStep) { lastStep.status = 'completed'; lastStep.completedAt = nowISO(); }

    const family = db.families.find((f) => f.id === session.familyId);
    addNotification(family?.userId ?? session.familyId, 'Emergency Resolved ✅', `The emergency for ${session.memberName} has been resolved. Patient is stable.`, 'success');
    addNotification('user_admin_1', 'Emergency Resolved', `Emergency #${id} for ${session.memberName} has been marked resolved.`, 'success');
    addTimelineEvent(session.familyId, 'emergency-resolved', '✅ Emergency Resolved', `Emergency for ${session.memberName} has been resolved.`, session.memberId);
    emitChange('emergency:resolved', { id });
  },
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export const notificationRepository = {
  getForUser(userId: string, filters?: { type?: string; read?: boolean; search?: string; page?: number; pageSize?: number }) {
    const db = getDb();
    let result = db.notifications.filter((n) => n.userId === userId || n.userId === 'user_admin_1');
    if (userId.startsWith('user_family')) {
      result = db.notifications.filter((n) => n.userId === userId);
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter((n) => n.type === filters.type);
    }
    if (filters?.read !== undefined) {
      result = result.filter((n) => n.read === filters.read);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total, unreadCount: result.filter(n => !n.read).length };
  },

  markRead(id: string) {
    const db = getDb();
    const notif = db.notifications.find((n) => n.id === id);
    if (notif) { notif.read = true; notif.updatedAt = nowISO(); }
  },

  markAllRead(userId: string) {
    const db = getDb();
    db.notifications.filter((n) => n.userId === userId && !n.read).forEach((n) => { n.read = true; n.updatedAt = nowISO(); });
  },

  delete(id: string) {
    const db = getDb();
    const idx = db.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) db.notifications.splice(idx, 1);
  },

  getAdminNotifications(filters?: { type?: string; page?: number }) {
    const db = getDb();
    let result = db.notifications.filter(
      (n) => n.userId === 'user_admin_1' || n.type === 'error' || n.type === 'warning'
    );
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const page = filters?.page ?? 1;
    const pageSize = 20;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total: result.length };
  },
};

// ─── TIMELINE ────────────────────────────────────────────────────────────────

export const timelineRepository = {
  getForFamily(familyId: string, filters?: { search?: string; page?: number; pageSize?: number }) {
    const db = getDb();
    let result = db.timeline.filter((t) => t.familyId === familyId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total };
  },

  getAll(filters?: { search?: string; type?: string; page?: number; pageSize?: number }) {
    const db = getDb();
    let result = [...db.timeline];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter((t) => t.eventType === filters.type);
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = result.length;
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total };
  },
};

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export const analyticsRepository = {
  getDashboardStats() {
    const db = getDb();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const totalFamilies = db.families.length;
    const totalFamilyMembers = db.families.reduce((sum, f) => sum + f.members.length, 0);
    const totalProviders = db.providers.length;
    const totalEmployees = db.employees.length;
    const activeEmergencies = (db.emergencies ?? []).filter((e: EmergencySession) => e.status === 'active').length;
    const todayCareRequests = db.requests.filter((r) => r.scheduledAt.startsWith(todayStr) || r.createdAt.startsWith(todayStr)).length || db.requests.slice(0, 8).length;
    const activeCareRequests = db.requests.filter((r) => ['accepted', 'in_progress', 'on_the_way', 'arrived'].includes(r.status)).length;
    const completedCareRequests = db.requests.filter((r) => r.status === 'completed').length;
    const pendingProviderVerifications = db.providers.filter((p) => !p.isVerified).length;
    const pendingEmployeeVerifications = db.employees.filter((e) => (e as any).verificationStatus === 'pending').length;
    const pendingReviews = (db.reviews ?? []).filter((r: any) => r.status === 'pending').length;

    const activeEmergencyList = (db.emergencies ?? []).filter((e: EmergencySession) => e.status === 'active').slice(0, 3);
    const recentActivities = db.timeline.slice(0, 10).map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description ?? '',
      severity: t.eventType.includes('emergency') ? 'critical' : t.eventType.includes('completed') ? 'info' : 'info',
      createdAt: t.createdAt,
    }));

    return {
      totalFamilies,
      totalFamilyMembers,
      totalProviders,
      totalEmployees,
      activeEmergencies,
      todayCareRequests,
      activeCareRequests,
      completedCareRequests,
      pendingProviderVerifications,
      pendingEmployeeVerifications,
      pendingReviews,
      platformHealth: 98,
      activeEmergencyList,
      recentActivities,
      pendingActions: {
        verifications: pendingProviderVerifications + pendingEmployeeVerifications,
        flaggedReviews: (db.reviews ?? []).filter((r: any) => r.isComplaint).length,
        pendingRequests: db.requests.filter((r) => r.status === 'requested').length,
      },
    };
  },

  getAnalytics() {
    const db = getDb();
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const requestTrends = months.map((month, i) => ({ month, total: 12 + i * 8 + Math.floor(Math.random() * 5) }));
    const emergencyTrends = months.map((month, i) => ({ month, count: 1 + i + Math.floor(Math.random() * 2) }));

    const categoryUsage = [
      { category: 'Home Nursing', count: 210, percentage: 32 },
      { category: 'Doctor Visit', count: 155, percentage: 23 },
      { category: 'Caregiver', count: 120, percentage: 18 },
      { category: 'Lab Test', count: 85, percentage: 13 },
      { category: 'Physiotherapy', count: 60, percentage: 9 },
      { category: 'Ambulance', count: 33, percentage: 5 },
    ];

    const ratingsDistribution = [
      { rating: 5, count: 98 },
      { rating: 4, count: 85 },
      { rating: 3, count: 42 },
      { rating: 2, count: 12 },
      { rating: 1, count: 5 },
    ];

    const topProviders = db.providers
      .filter((p) => p.isVerified)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name, rating: p.rating, requestCount: p.reviewCount }));

    const topEmployees = db.employees
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5)
      .map((e) => ({ id: e.id, name: e.name, rating: e.rating, completedCount: e.completedRequestsCount }));

    return {
      avgResponseTimeMinutes: 8,
      requestTrends,
      emergencyTrends,
      categoryUsage,
      ratingsDistribution,
      topProviders,
      topEmployees,
    };
  },
};

// ─── GLOBAL SEARCH ────────────────────────────────────────────────────────────

export const searchRepository = {
  globalSearch(query: string) {
    if (!query || query.length < 2) return { results: [], total: 0 };
    const db = getDb();
    const q = query.toLowerCase();
    const results: Array<{ type: string; id: string; title: string; subtitle: string; url: string }> = [];

    // Families
    db.families.filter((f) => f.name.toLowerCase().includes(q) || f.primaryContactName.toLowerCase().includes(q))
      .slice(0, 5).forEach((f) => results.push({ type: 'family', id: f.id, title: f.name, subtitle: `${f.address.city} · ${f.members.length} members`, url: `/portal/admin/families/${f.id}` }));

    // Members
    db.families.flatMap((f) => f.members.filter((m) => m.name.toLowerCase().includes(q)))
      .slice(0, 5).forEach((m) => results.push({ type: 'member', id: m.id, title: m.name, subtitle: `${m.relationship} · ${m.medicalConditions?.slice(0, 1).join(', ') ?? ''}`, url: `/portal/admin/families/${m.familyId}` }));

    // Providers
    db.providers.filter((p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))
      .slice(0, 5).forEach((p) => results.push({ type: 'provider', id: p.id, title: p.name, subtitle: `${p.type} · ${p.address.city}`, url: `/portal/admin/providers/${p.id}` }));

    // Employees
    db.employees.filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
      .slice(0, 5).forEach((e) => results.push({ type: 'employee', id: e.id, title: e.name, subtitle: `${e.role} · ${e.department}`, url: `/portal/admin/employees` }));

    // Care Requests
    db.requests.filter((r) => r.patientName?.toLowerCase().includes(q) || r.categoryLabel?.toLowerCase().includes(q) || r.providerName?.toLowerCase().includes(q))
      .slice(0, 5).forEach((r) => results.push({ type: 'request', id: r.id, title: `${r.categoryLabel} — ${r.patientName}`, subtitle: `${r.status} · ₹${r.estimatedCost}`, url: `/portal/admin/requests` }));

    // Timeline
    db.timeline.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
      .slice(0, 5).forEach((t) => results.push({ type: 'timeline', id: t.id, title: t.title, subtitle: t.description ?? '', url: `/portal/admin/timeline` }));

    return { results, total: results.length };
  },
};

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export const documentRepository = {
  getAll(filters?: { search?: string; type?: string; ownerId?: string }) {
    const db = getDb();
    let result: any[] = [...(db.documents ?? [])];
    if (filters?.ownerId) result = result.filter((d) => d.ownerId === filters.ownerId);
    if (filters?.type && filters.type !== 'all') result = result.filter((d) => d.type === filters.type);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((d) => d.title.toLowerCase().includes(q) || d.ownerName?.toLowerCase().includes(q));
    }
    return { data: result, total: result.length };
  },

  verify(id: string) {
    const db = getDb();
    const doc = (db.documents ?? []).find((d: any) => d.id === id);
    if (doc) { (doc as any).status = 'verified'; (doc as any).updatedAt = nowISO(); }
    emitChange('document:verified', { id });
  },
};

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export const reviewRepository = {
  getAll(filters?: { search?: string; status?: string; page?: number; pageSize?: number }) {
    const db = getDb();
    let result: any[] = [...(db.reviews ?? [])];
    if (filters?.status && filters.status !== 'all') result = result.filter((r) => r.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((r) => r.reviewerName?.toLowerCase().includes(q) || r.comment?.toLowerCase().includes(q));
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total: result.length };
  },

  flag(id: string) {
    const db = getDb();
    const rev = (db.reviews ?? []).find((r: any) => r.id === id);
    if (rev) { (rev as any).status = 'flagged'; (rev as any).updatedAt = nowISO(); }
    emitChange('review:flagged', { id });
  },

  resolve(id: string) {
    const db = getDb();
    const rev = (db.reviews ?? []).find((r: any) => r.id === id);
    if (rev) { (rev as any).status = 'resolved'; (rev as any).updatedAt = nowISO(); }
    emitChange('review:resolved', { id });
  },
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const categoryRepository = {
  getAll() {
    const db = getDb();
    const cats = db.categories ?? [];
    return cats.map((c: any) => ({
      ...c,
      providerCount: db.providers.filter((p) => p.services?.some((s) => s.toLowerCase().includes(c.label?.toLowerCase() ?? c.name?.toLowerCase()))).length,
      requestCount: db.requests.filter((r) => r.category === c.id).length,
    }));
  },

  create(data: any) {
    const db = getDb();
    if (!db.categories) {
      db.categories = [];
    }
    const newCategory = {
      id: data.id || createId('cat'),
      name: data.name || 'New Category',
      icon: data.icon || 'Sparkles',
      description: data.description || '',
      color: data.color || '#3B82F6',
      enabled: data.enabled ?? true,
      items: data.items || [],
      createdAt: nowISO(),
      updatedAt: nowISO(),
      ...data,
    };
    db.categories.push(newCategory);
    emitChange('category:created', { id: newCategory.id });
    return newCategory;
  },

  toggle(id: string) {
    const db = getDb();
    const cat = (db.categories ?? []).find((c: any) => c.id === id);
    if (cat) { (cat as any).enabled = !(cat as any).enabled; }
    emitChange('category:toggled', { id });
  },

  update(id: string, patch: any) {
    const db = getDb();
    const cat = (db.categories ?? []).find((c: any) => c.id === id);
    if (cat) {
      Object.assign(cat, patch, { updatedAt: nowISO() });
      emitChange('category:updated', { id });
    }
    return cat;
  },

  delete(id: string) {
    const db = getDb();
    if (db.categories) {
      db.categories = db.categories.filter((c: any) => c.id !== id);
      emitChange('category:deleted', { id });
    }
  },
};

export const db = { getDb };
