import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careProviderPortalService } from '@/services/care-provider-portal.service';
import { employeePortalService } from '@/services/employee-portal.service';
import { adminPortalService } from '@/services/admin-portal.service';
import type { CareRequestStatus, EmployeeAvailabilityStatus, Employee, ProviderServiceItem, AvailabilityConfig, OrganizationProfile, ProviderDocument } from '@/types';

// Query Keys
export const PORTAL_QUERY_KEYS = {
  providerOverview: ['provider', 'overview'],
  providerRequests: (filters?: Record<string, unknown>) => ['provider', 'requests', filters],
  providerRequestDetail: (id: string) => ['provider', 'requests', id],
  providerEmployees: (filters?: Record<string, unknown>) => ['provider', 'employees', filters],
  providerEmployeeDetail: (id: string) => ['provider', 'employees', id],
  providerServices: ['provider', 'services'],
  providerAvailability: ['provider', 'availability'],
  providerOrgProfile: ['provider', 'orgProfile'],
  providerDocuments: ['provider', 'documents'],
  providerReviews: (sortBy?: string) => ['provider', 'reviews', sortBy],
  
  employeeProfile: (id?: string) => ['employee', 'profile', id],
  employeeDashboard: (id?: string) => ['employee', 'dashboard', id],
  employeeRequests: (id?: string) => ['employee', 'requests', id],
  employeeRequestDetail: (id: string) => ['employee', 'request-detail', id],

  // Admin keys
  adminDashboard: ['admin', 'dashboard'],
  adminFamilies: (f?: Record<string, unknown>) => ['admin', 'families', f],
  adminFamily: (id: string) => ['admin', 'family', id],
  adminProviders: (f?: Record<string, unknown>) => ['admin', 'providers', f],
  adminProvider: (id: string) => ['admin', 'provider', id],
  adminEmployees: (f?: Record<string, unknown>) => ['admin', 'employees', f],
  adminEmployee: (id: string) => ['admin', 'employee', id],
  adminRequests: (f?: Record<string, unknown>) => ['admin', 'requests', f],
  adminEmergencies: (f?: Record<string, unknown>) => ['admin', 'emergencies', f],
  adminEmergency: (id: string) => ['admin', 'emergency', id],
  adminVerification: (f?: Record<string, unknown>) => ['admin', 'verification', f],
  adminDocuments: (f?: Record<string, unknown>) => ['admin', 'documents', f],
  adminReviews: (f?: Record<string, unknown>) => ['admin', 'reviews', f],
  adminNotifications: (f?: Record<string, unknown>) => ['admin', 'notifications', f],
  adminCategories: ['admin', 'categories'],
  adminTimeline: (f?: Record<string, unknown>) => ['admin', 'timeline', f],
  adminAnalytics: ['admin', 'analytics'],
  adminSettings: ['admin', 'settings'],
  adminSearch: (q: string) => ['admin', 'search', q],
};

// ── Service Provider Hooks ────────────────────────────────────────────────
export const useProviderOverviewQuery = () => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerOverview,
    queryFn: () => careProviderPortalService.getDashboardOverview(),
    select: (res) => res.data,
  });
};

export const useProviderRequestsQuery = (filters?: { status?: string; search?: string; priority?: string }) => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerRequests(filters),
    queryFn: () => careProviderPortalService.getCareRequests(filters),
    select: (res) => res.data ?? [],
  });
};

export const useProviderRequestDetailQuery = (id: string) => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerRequestDetail(id),
    queryFn: () => careProviderPortalService.getCareRequestById(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });
};

export const useProviderEmployeesQuery = (filters?: { search?: string; status?: string; availability?: string; department?: string }) => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerEmployees(filters),
    queryFn: () => careProviderPortalService.getEmployees(filters),
    select: (res) => res.data ?? [],
  });
};

export const useProviderEmployeeDetailQuery = (id: string) => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerEmployeeDetail(id),
    queryFn: () => careProviderPortalService.getEmployeeById(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });
};

export const useProviderServicesQuery = () => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerServices,
    queryFn: () => careProviderPortalService.getServices(),
    select: (res) => res.data ?? [],
  });
};

export const useProviderAvailabilityQuery = () => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerAvailability,
    queryFn: () => careProviderPortalService.getAvailability(),
    select: (res) => res.data,
  });
};

export const useProviderOrgProfileQuery = () => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerOrgProfile,
    queryFn: () => careProviderPortalService.getOrganizationProfile(),
    select: (res) => res.data,
  });
};

export const useProviderDocumentsQuery = () => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerDocuments,
    queryFn: () => careProviderPortalService.getDocuments(),
    select: (res) => res.data ?? [],
  });
};

export const useProviderReviewsQuery = (sortBy: 'newest' | 'highest' | 'lowest' = 'newest') => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.providerReviews(sortBy),
    queryFn: () => careProviderPortalService.getReviews(sortBy),
    select: (res) => res.data ?? [],
  });
};

// Provider Mutations
export const useAcceptRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careProviderPortalService.acceptRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider'] });
      queryClient.invalidateQueries({ queryKey: ['care-request'] });
    },
  });
};

export const useRejectRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => careProviderPortalService.rejectRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider'] });
      queryClient.invalidateQueries({ queryKey: ['care-request'] });
    },
  });
};

export const useUpdateRequestStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: CareRequestStatus; note?: string }) =>
      careProviderPortalService.updateRequestStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider'] });
      queryClient.invalidateQueries({ queryKey: ['care-request'] });
    },
  });
};

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
      careProviderPortalService.createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'employees'] });
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Employee> }) =>
      careProviderPortalService.updateEmployee(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'employees'] });
    },
  });
};

export const useToggleEmployeeStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careProviderPortalService.toggleEmployeeStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'employees'] });
    },
  });
};

export const useToggleServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careProviderPortalService.toggleServiceEnabled(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'services'] });
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ProviderServiceItem> }) =>
      careProviderPortalService.updateService(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'services'] });
    },
  });
};

export const useUpdateAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<AvailabilityConfig>) => careProviderPortalService.updateAvailability(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'availability'] });
    },
  });
};

export const useUpdateOrgProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<OrganizationProfile>) => careProviderPortalService.updateOrganizationProfile(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'orgProfile'] });
    },
  });
};

export const useUploadDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doc: Omit<ProviderDocument, 'id' | 'uploadedAt' | 'verificationStatus'>) =>
      careProviderPortalService.uploadDocument(doc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'documents'] });
    },
  });
};

export const useRespondReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, responseText }: { reviewId: string; responseText: string }) =>
      careProviderPortalService.respondToReview(reviewId, responseText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'reviews'] });
    },
  });
};

// ── Employee Hooks ───────────────────────────────────────────────────────
export const useEmployeeProfileQuery = (employeeId = 'emp_1') => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.employeeProfile(employeeId),
    queryFn: () => employeePortalService.getEmployeeProfile(employeeId),
    select: (res) => res.data,
  });
};

export const useEmployeeDashboardQuery = (employeeId = 'emp_1') => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.employeeDashboard(employeeId),
    queryFn: () => employeePortalService.getEmployeeDashboard(employeeId),
    select: (res) => res.data,
  });
};

export const useEmployeeRequestsQuery = (employeeId = 'emp_1') => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.employeeRequests(employeeId),
    queryFn: () => employeePortalService.getAssignedRequests(employeeId),
    select: (res) => res.data ?? [],
  });
};

export const useEmployeeRequestDetailQuery = (requestId: string) => {
  return useQuery({
    queryKey: PORTAL_QUERY_KEYS.employeeRequestDetail(requestId),
    queryFn: () => employeePortalService.getRequestDetails(requestId),
    select: (res) => res.data,
    enabled: Boolean(requestId),
  });
};

export const useEmployeeStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, status }: { employeeId: string; status: EmployeeAvailabilityStatus }) =>
      employeePortalService.updateEmployeeStatus(employeeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee'] });
      queryClient.invalidateQueries({ queryKey: ['provider'] });
    },
  });
};

export const useEmployeeWorkflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, nextStatus, note }: { requestId: string; nextStatus: CareRequestStatus; note?: string }) =>
      employeePortalService.updateWorkflowStatus(requestId, nextStatus, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee'] });
      queryClient.invalidateQueries({ queryKey: ['provider'] });
    },
  });
};

export const useSubmitServiceNotesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof employeePortalService.submitServiceNotes>[0]) =>
      employeePortalService.submitServiceNotes(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee'] });
      queryClient.invalidateQueries({ queryKey: ['provider'] });
    },
  });
};

// ── Admin Hooks ───────────────────────────────────────────────────────────

export const useAdminDashboardQuery = () =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminDashboard, queryFn: () => adminPortalService.getDashboardStats(), select: (r) => r.data });

export const useAdminFamiliesQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminFamilies(filters), queryFn: () => adminPortalService.getFamilies(filters as any), select: (r) => r.data ?? [] });

export const useAdminFamilyQuery = (id: string) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminFamily(id), queryFn: () => adminPortalService.getFamilyById(id), select: (r) => r.data, enabled: Boolean(id) });

export const useAdminProvidersQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminProviders(filters), queryFn: () => adminPortalService.getProviders(filters as any), select: (r) => r.data ?? [] });

export const useAdminProviderQuery = (id: string) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminProvider(id), queryFn: () => adminPortalService.getProviderById(id), select: (r) => r.data, enabled: Boolean(id) });

export const useAdminEmployeesQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminEmployees(filters), queryFn: () => adminPortalService.getAdminEmployees(filters as any), select: (r) => r.data ?? [] });

export const useAdminEmployeeQuery = (id: string) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminEmployee(id), queryFn: () => adminPortalService.getAdminEmployeeById(id), select: (r) => r.data, enabled: Boolean(id) });

export const useAdminCareRequestsQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminRequests(filters), queryFn: () => adminPortalService.getAdminCareRequests(filters as any), select: (r) => r.data ?? [] });

export const useAdminEmergenciesQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminEmergencies(filters), queryFn: () => adminPortalService.getEmergencies(filters as any), select: (r) => r.data ?? [], refetchInterval: 30000 });

export const useAdminEmergencyQuery = (id: string) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminEmergency(id), queryFn: () => adminPortalService.getEmergencyById(id), select: (r) => r.data, enabled: Boolean(id), refetchInterval: 15000 });

export const useVerificationQueueQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminVerification(filters), queryFn: () => adminPortalService.getVerificationQueue(filters as any), select: (r) => r.data ?? [] });

export const useAdminDocumentsQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminDocuments(filters), queryFn: () => adminPortalService.getAdminDocuments(filters as any), select: (r) => r.data ?? [] });

export const useAdminReviewsQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminReviews(filters), queryFn: () => adminPortalService.getAdminReviews(filters as any), select: (r) => r.data ?? [] });

export const useAdminNotificationsQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminNotifications(filters), queryFn: () => adminPortalService.getAdminNotifications(filters as any), select: (r) => r.data ?? [] });

export const useAdminCategoriesQuery = () =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminCategories, queryFn: () => adminPortalService.getCategories(), select: (r) => r.data ?? [] });

export const useAdminTimelineQuery = (filters?: Record<string, unknown>) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminTimeline(filters), queryFn: () => adminPortalService.getPlatformTimeline(filters as any), select: (r) => r.data });

export const useAdminAnalyticsQuery = () =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminAnalytics, queryFn: () => adminPortalService.getAnalytics(), select: (r) => r.data });

export const useAdminSettingsQuery = () =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminSettings, queryFn: () => adminPortalService.getSettings(), select: (r) => r.data });

export const useAdminSearchQuery = (query: string) =>
  useQuery({ queryKey: PORTAL_QUERY_KEYS.adminSearch(query), queryFn: () => adminPortalService.globalSearch(query), select: (r) => r.data, enabled: query.length > 1 });

// Admin Mutations — all invalidate across all portals
const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['admin'] });
  qc.invalidateQueries({ queryKey: ['provider'] });
  qc.invalidateQueries({ queryKey: ['employee'] });
  qc.invalidateQueries({ queryKey: ['family'] });
  qc.invalidateQueries({ queryKey: ['care-request'] });
  qc.invalidateQueries({ queryKey: ['notifications'] });
};

export const useApproveProviderMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.approveProvider(id), onSuccess: () => invalidateAll(qc) });
};

export const useRejectProviderMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => adminPortalService.rejectProvider(id, reason), onSuccess: () => invalidateAll(qc) });
};

export const useSuspendProviderMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.suspendProvider(id), onSuccess: () => invalidateAll(qc) });
};

export const useApproveEmployeeMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.approveEmployee(id), onSuccess: () => invalidateAll(qc) });
};

export const useSuspendEmployeeMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.suspendEmployee(id), onSuccess: () => invalidateAll(qc) });
};

export const useApproveVerificationMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.approveVerification(id), onSuccess: () => invalidateAll(qc) });
};

export const useRejectVerificationMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => adminPortalService.rejectVerification(id, reason), onSuccess: () => invalidateAll(qc) });
};

export const useVerifyDocumentMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.verifyDocument(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'documents'] }); } });
};

export const useFlagReviewMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.flagReview(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }); } });
};

export const useResolveReviewMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.resolveReview(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }); } });
};

export const useMarkNotificationReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.markNotificationRead(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'notifications'] }); } });
};

export const useMarkAllNotificationsReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => adminPortalService.markAllNotificationsRead(), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'notifications'] }); } });
};

export const useCreateCategoryMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: any) => adminPortalService.createCategory(data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); } });
};

export const useUpdateCategoryMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, patch }: { id: string; patch: any }) => adminPortalService.updateCategory(id, patch), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); } });
};

export const useDeleteCategoryMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.deleteCategory(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); } });
};

export const useToggleCategoryMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminPortalService.toggleCategory(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); } });
};

export const useUpdatePlatformSettingsMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (patch: any) => adminPortalService.updateSettings(patch), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'settings'] }); } });
};

export const useUpdateFamilyMemberMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ familyId, memberId, patch }: { familyId: string; memberId: string; patch: any }) =>
      adminPortalService.updateFamilyMember(familyId, memberId, patch),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: PORTAL_QUERY_KEYS.adminFamily(vars.familyId) });
      qc.invalidateQueries({ queryKey: PORTAL_QUERY_KEYS.adminFamilies() });
    },
  });
};


