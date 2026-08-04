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
  mockProviderServices,
  mockAvailabilityConfig,
  mockOrganizationProfile,
  mockProviderDocuments,
  mockProviderReviewsExtended,
  mockServiceNotes,
  mockNotifications,
} from '@/utils/mock-data';
import { careRequestRepository, employeeRepository } from '@/services/central-repository';

// Provider-specific local stores (not shared across portals)
let servicesStore: ProviderServiceItem[] = [...mockProviderServices];
let availabilityStore: AvailabilityConfig = { ...mockAvailabilityConfig };
let organizationStore: OrganizationProfile = { ...mockOrganizationProfile };
let documentsStore: ProviderDocument[] = [...mockProviderDocuments];
let reviewsStore = [...mockProviderReviewsExtended];
let serviceNotesStore: ServiceNote[] = [...mockServiceNotes];

// Provider ID for this portal session
const PROVIDER_ID = 'prov_1';


export const careProviderPortalService = {
  // ── Overview / Dashboard ──────────────────────────────────────────────────
  async getDashboardOverview() {
    const today = new Date().toISOString().split('T')[0];
    const allProviderRequests = careRequestRepository.getAll({ providerId: PROVIDER_ID }).data;
    const todayRequests = allProviderRequests.filter((r) => r.scheduledAt?.startsWith(today) || r.createdAt.startsWith(today));
    const pending = allProviderRequests.filter((r) => r.status === 'requested');
    const active = allProviderRequests.filter((r) =>
      ['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(r.status)
    );
    const completed = allProviderRequests.filter((r) => r.status === 'completed');
    const allProviderEmployees = employeeRepository.getAll({ providerId: PROVIDER_ID }).data;
    const availableEmployees = allProviderEmployees.filter((e) => e.availability === 'available');
    const unavailableEmployees = allProviderEmployees.filter((e) => e.availability !== 'available');

    const totalRevenue = completed.reduce((sum, r) => sum + (r.estimatedCost ?? 200), 0) + 14800;
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
          totalCount: allProviderEmployees.length,
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

  // ── Care Requests ─────────────────────────────────────────────────────────
  // All care request reads/writes go through the central repository so changes
  // are immediately visible in the admin and family portals.
  async getCareRequests(filters?: { status?: string; search?: string; priority?: string }) {
    const result = careRequestRepository.getAll({ providerId: PROVIDER_ID, ...filters });
    return mockRequest(result.data, { latency: 300 });
  },

  async getCareRequestById(id: string): Promise<ApiResult<CareRequest>> {
    const found = careRequestRepository.getById(id);
    if (!found) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    return mockRequest(found, { latency: 200 });
  },

  async acceptRequest(id: string): Promise<ApiResult<CareRequest>> {
    const updated = careRequestRepository.updateStatus(id, 'accepted');
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    return mockRequest(updated, { latency: 350 });
  },

  async rejectRequest(id: string, reason?: string): Promise<ApiResult<CareRequest>> {
    const updated = careRequestRepository.updateStatus(id, 'cancelled', { note: reason ?? 'Provider was unable to fulfill request at specified time.' });
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    return mockRequest(updated, { latency: 350 });
  },

  async updateRequestStatus(
    id: string,
    status: CareRequestStatus,
    note?: string
  ): Promise<ApiResult<CareRequest>> {
    const updated = careRequestRepository.updateStatus(id, status, { note });
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    return mockRequest(updated, { latency: 350 });
  },

  async addInternalNote(requestId: string, note: string): Promise<ApiResult<CareRequest>> {
    const req = careRequestRepository.getById(requestId);
    if (!req) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    const internalNotes = [...(req.internalNotes ?? []), `${nowISO().slice(11, 16)}: ${note}`];
    (req as any).internalNotes = internalNotes;
    (req as any).updatedAt = nowISO();
    return mockRequest(req, { latency: 250 });
  },

  async addAttachment(requestId: string, attachment: { name: string; url: string; kind: 'image' | 'document' }): Promise<ApiResult<CareRequest>> {
    const updated = careRequestRepository.addAttachment(requestId, attachment);
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    return mockRequest(updated, { latency: 400 });
  },

  // ── Employee Management (via central repository) ──────────────────────────
  async getEmployees(filters?: { search?: string; status?: string; availability?: string; department?: string }) {
    const result = employeeRepository.getAll({ providerId: PROVIDER_ID, ...filters });
    return mockRequest(result.data, { latency: 300 });
  },

  async getEmployeeById(id: string): Promise<ApiResult<Employee>> {
    const employee = employeeRepository.getById(id);
    if (!employee) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };
    return mockRequest(employee as Employee, { latency: 200 });
  },

  async createEmployee(input: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Employee>> {
    const now = nowISO();
    const newEmp: Employee = {
      ...input,
      id: createId('emp'),
      providerId: PROVIDER_ID,
      rating: 5.0,
      reviewCount: 0,
      assignedRequestsCount: 0,
      completedRequestsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    // Add to the central repository database
    const { db } = await import('@/services/central-repository');
    db.getDb().employees.unshift(newEmp);
    return mockRequest(newEmp, { latency: 450 });
  },

  async updateEmployee(id: string, patch: Partial<Employee>): Promise<ApiResult<Employee>> {
    const emp = employeeRepository.getById(id);
    if (!emp) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };
    Object.assign(emp, { ...patch, updatedAt: nowISO() });
    return mockRequest(emp as Employee, { latency: 350 });
  },

  async toggleEmployeeStatus(id: string): Promise<ApiResult<Employee>> {
    const emp = employeeRepository.getById(id);
    if (!emp) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };
    const newStatus = (emp as any).status === 'active' ? 'inactive' : 'active';
    (emp as any).status = newStatus;
    (emp as any).updatedAt = nowISO();
    return mockRequest(emp as Employee, { latency: 300 });
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
