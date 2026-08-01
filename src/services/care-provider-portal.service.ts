import type {
  ApiResult,
  CareRequest,
  CareRequestStatus,
  Employee,
  ProviderServiceItem,
  AvailabilityConfig,
  OrganizationProfile,
  ProviderDocument,
  ServiceNote,
} from '@/types';
import { mockRequest, createId, nowISO } from '@/lib/mock-api';
import {
  mockCareRequests,
  mockEmployees,
  mockProviderServices,
  mockAvailabilityConfig,
  mockOrganizationProfile,
  mockProviderDocuments,
  mockProviderReviewsExtended,
  mockServiceNotes,
  mockNotifications,
} from '@/utils/mock-data';

let requestsStore: CareRequest[] = [...mockCareRequests];
let employeesStore: Employee[] = [...mockEmployees];
let servicesStore: ProviderServiceItem[] = [...mockProviderServices];
let availabilityStore: AvailabilityConfig = { ...mockAvailabilityConfig };
let organizationStore: OrganizationProfile = { ...mockOrganizationProfile };
let documentsStore: ProviderDocument[] = [...mockProviderDocuments];
let reviewsStore = [...mockProviderReviewsExtended];
let serviceNotesStore: ServiceNote[] = [...mockServiceNotes];

export const careProviderPortalService = {
  // ── Overview / Dashboard ──────────────────────────────────────────────────
  async getDashboardOverview() {
    const today = new Date().toISOString().split('T')[0];
    const todayRequests = requestsStore.filter((r) => r.scheduledAt.startsWith(today) || r.createdAt.startsWith(today));
    const pending = requestsStore.filter((r) => r.status === 'pending');
    const active = requestsStore.filter((r) =>
      ['accepted', 'employee_assigned', 'professional_assigned', 'on_the_way', 'arrived', 'in_progress'].includes(r.status)
    );
    const completed = requestsStore.filter((r) => r.status === 'completed' || r.status === 'awaiting_review');
    const availableEmployees = employeesStore.filter((e) => e.availability === 'available');
    const unavailableEmployees = employeesStore.filter((e) => e.availability !== 'available');

    const totalRevenue = completed.reduce((sum, r) => sum + (r.estimatedCost ?? 200), 0) + 14800; // Mocked historical revenue
    const avgRating = 4.88;

    return mockRequest(
      {
        todayOverview: {
          todayCount: todayRequests.length,
          pendingCount: pending.length,
          activeCount: active.length,
          completedCount: completed.length,
        },
        employeeStats: {
          availableCount: availableEmployees.length,
          unavailableCount: unavailableEmployees.length,
          totalCount: employeesStore.length,
        },
        revenueSummary: {
          totalRevenue,
          currency: '₹',
          monthlyGrowthPercent: 14.5,
          thisMonthEarnings: 18450,
          pendingPayout: 3200,
        },
        ratingSummary: {
          overallRating: avgRating,
          totalReviews: reviewsStore.length,
        },
        recentNotifications: mockNotifications.filter((n) => n.userId === 'user_provider_1').slice(0, 5),
      },
      { latency: 300 }
    );
  },

  // ── Care Requests ────────────────────────────────────────────────────────
  async getCareRequests(filters?: { status?: string; search?: string; priority?: string }) {
    let result = [...requestsStore];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      result = result.filter((r) => r.priority === filters.priority);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.patientName?.toLowerCase().includes(q) ||
          r.familyName?.toLowerCase().includes(q) ||
          r.categoryLabel?.toLowerCase().includes(q) ||
          r.employeeName?.toLowerCase().includes(q)
      );
    }
    return mockRequest(result, { latency: 300 });
  },

  async getCareRequestById(id: string): Promise<ApiResult<CareRequest>> {
    const found = requestsStore.find((r) => r.id === id);
    if (!found) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    return mockRequest(found, { latency: 200 });
  },

  async acceptRequest(id: string): Promise<ApiResult<CareRequest>> {
    const idx = requestsStore.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };

    const now = nowISO();
    const timeline = requestsStore[idx].timeline ? [...requestsStore[idx].timeline!] : [];
    timeline.push({
      status: 'accepted',
      title: 'Care Request Accepted',
      description: 'Provider accepted the care request. Ready for staff assignment.',
      timestamp: now,
    });

    requestsStore[idx] = {
      ...requestsStore[idx],
      status: 'accepted',
      timeline,
      updatedAt: now,
    };
    return mockRequest(requestsStore[idx], { latency: 350 });
  },

  async rejectRequest(id: string, reason?: string): Promise<ApiResult<CareRequest>> {
    const idx = requestsStore.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };

    const now = nowISO();
    const timeline = requestsStore[idx].timeline ? [...requestsStore[idx].timeline!] : [];
    timeline.push({
      status: 'cancelled',
      title: 'Request Declined by Provider',
      description: reason ?? 'Provider was unable to fulfill request at specified time.',
      timestamp: now,
    });

    requestsStore[idx] = {
      ...requestsStore[idx],
      status: 'cancelled',
      timeline,
      updatedAt: now,
    };
    return mockRequest(requestsStore[idx], { latency: 350 });
  },

  async assignEmployee(requestId: string, employeeId: string): Promise<ApiResult<CareRequest>> {
    const reqIdx = requestsStore.findIndex((r) => r.id === requestId);
    if (reqIdx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };

    const employee = employeesStore.find((e) => e.id === employeeId);
    if (!employee) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };

    const now = nowISO();
    const timeline = requestsStore[reqIdx].timeline ? [...requestsStore[reqIdx].timeline!] : [];
    timeline.push({
      status: 'employee_assigned',
      title: `Assigned: ${employee.name}`,
      description: `${employee.role} ${employee.name} assigned to visit.`,
      timestamp: now,
    });

    requestsStore[reqIdx] = {
      ...requestsStore[reqIdx],
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.role,
      employeePhone: employee.contact.phone,
      status: 'employee_assigned',
      timeline,
      updatedAt: now,
    };

    return mockRequest(requestsStore[reqIdx], { latency: 400 });
  },

  async updateRequestStatus(
    id: string,
    status: CareRequestStatus,
    note?: string
  ): Promise<ApiResult<CareRequest>> {
    const idx = requestsStore.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };

    const now = nowISO();
    const statusTitles: Record<CareRequestStatus, string> = {
      pending: 'Pending Acceptance',
      accepted: 'Care Request Accepted',
      employee_assigned: 'Staff Assigned',
      professional_assigned: 'Professional Assigned',
      on_the_way: 'Professional En Route',
      arrived: 'Arrived at Patient Address',
      in_progress: 'Care Service In Progress',
      completed: 'Care Service Completed',
      awaiting_review: 'Service Complete - Awaiting Review',
      cancelled: 'Care Request Cancelled',
      requested: 'Request Submitted',
    };

    const timeline = requestsStore[idx].timeline ? [...requestsStore[idx].timeline!] : [];
    timeline.push({
      status,
      title: statusTitles[status] ?? status,
      description: note ?? `Status updated to ${status.replace(/_/g, ' ')}`,
      timestamp: now,
    });

    requestsStore[idx] = {
      ...requestsStore[idx],
      status,
      timeline,
      updatedAt: now,
    };
    return mockRequest(requestsStore[idx], { latency: 350 });
  },

  async addInternalNote(requestId: string, note: string): Promise<ApiResult<CareRequest>> {
    const idx = requestsStore.findIndex((r) => r.id === requestId);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };

    const internalNotes = requestsStore[idx].internalNotes ? [...requestsStore[idx].internalNotes!] : [];
    internalNotes.push(`${nowISO().slice(11, 16)}: ${note}`);

    requestsStore[idx] = {
      ...requestsStore[idx],
      internalNotes,
      updatedAt: nowISO(),
    };
    return mockRequest(requestsStore[idx], { latency: 250 });
  },

  // ── Employee Management ────────────────────────────────────────────────---
  async getEmployees(filters?: { search?: string; status?: string; availability?: string; department?: string }) {
    let result = [...employeesStore];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters?.availability && filters.availability !== 'all') {
      result = result.filter((e) => e.availability === filters.availability);
    }
    if (filters?.department && filters.department !== 'all') {
      result = result.filter((e) => e.department === filters.department);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department?.toLowerCase().includes(q) ||
          e.licenseNumber?.toLowerCase().includes(q)
      );
    }
    return mockRequest(result, { latency: 300 });
  },

  async getEmployeeById(id: string): Promise<ApiResult<Employee>> {
    const employee = employeesStore.find((e) => e.id === id);
    if (!employee) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };
    return mockRequest(employee, { latency: 200 });
  },

  async createEmployee(input: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Employee>> {
    const now = nowISO();
    const newEmp: Employee = {
      ...input,
      id: createId('emp'),
      providerId: 'prov_1',
      rating: 5.0,
      reviewCount: 0,
      assignedRequestsCount: 0,
      completedRequestsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    employeesStore.unshift(newEmp);
    return mockRequest(newEmp, { latency: 450 });
  },

  async updateEmployee(id: string, patch: Partial<Employee>): Promise<ApiResult<Employee>> {
    const idx = employeesStore.findIndex((e) => e.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };

    employeesStore[idx] = {
      ...employeesStore[idx],
      ...patch,
      updatedAt: nowISO(),
    };
    return mockRequest(employeesStore[idx], { latency: 350 });
  },

  async toggleEmployeeStatus(id: string): Promise<ApiResult<Employee>> {
    const idx = employeesStore.findIndex((e) => e.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };

    const newStatus = employeesStore[idx].status === 'active' ? 'inactive' : 'active';
    employeesStore[idx] = {
      ...employeesStore[idx],
      status: newStatus,
      updatedAt: nowISO(),
    };
    return mockRequest(employeesStore[idx], { latency: 300 });
  },

  // ── Services ─────────────────────────────────────────────────────────────
  async getServices() {
    return mockRequest(servicesStore, { latency: 250 });
  },

  async toggleServiceEnabled(id: string): Promise<ApiResult<ProviderServiceItem>> {
    const idx = servicesStore.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } };

    servicesStore[idx] = {
      ...servicesStore[idx],
      enabled: !servicesStore[idx].enabled,
    };
    return mockRequest(servicesStore[idx], { latency: 300 });
  },

  async updateService(id: string, patch: Partial<ProviderServiceItem>): Promise<ApiResult<ProviderServiceItem>> {
    const idx = servicesStore.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } };

    servicesStore[idx] = { ...servicesStore[idx], ...patch };
    return mockRequest(servicesStore[idx], { latency: 350 });
  },

  // ── Availability ─────────────────────────────────────────────────────────
  async getAvailability() {
    return mockRequest(availabilityStore, { latency: 200 });
  },

  async updateAvailability(patch: Partial<AvailabilityConfig>): Promise<ApiResult<AvailabilityConfig>> {
    availabilityStore = { ...availabilityStore, ...patch };
    return mockRequest(availabilityStore, { latency: 350 });
  },

  // ── Organization Profile ─────────────────────────────────────────────────
  async getOrganizationProfile() {
    return mockRequest(organizationStore, { latency: 200 });
  },

  async updateOrganizationProfile(patch: Partial<OrganizationProfile>): Promise<ApiResult<OrganizationProfile>> {
    organizationStore = { ...organizationStore, ...patch };
    return mockRequest(organizationStore, { latency: 400 });
  },

  // ── Documents ─────────────────────────────────────────────────────────────
  async getDocuments() {
    return mockRequest(documentsStore, { latency: 250 });
  },

  async uploadDocument(doc: Omit<ProviderDocument, 'id' | 'uploadedAt' | 'verificationStatus'>): Promise<ApiResult<ProviderDocument>> {
    const newDoc: ProviderDocument = {
      ...doc,
      id: createId('doc'),
      uploadedAt: nowISO(),
      verificationStatus: 'pending',
    };
    documentsStore.unshift(newDoc);
    return mockRequest(newDoc, { latency: 500 });
  },

  // ── Reviews ───────────────────────────────────────────────────────────────
  async getReviews(sortBy: 'newest' | 'highest' | 'lowest' = 'newest') {
    let list = [...reviewsStore];
    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return mockRequest(list, { latency: 250 });
  },

  async respondToReview(reviewId: string, responseText: string) {
    const idx = reviewsStore.findIndex((r) => r.id === reviewId);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } };

    reviewsStore[idx] = {
      ...reviewsStore[idx],
      response: { text: responseText, respondedAt: nowISO() },
    };
    return mockRequest(reviewsStore[idx], { latency: 350 });
  },
};

export default careProviderPortalService;
