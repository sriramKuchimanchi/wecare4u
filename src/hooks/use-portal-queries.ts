import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careProviderPortalService } from '@/services/care-provider-portal.service';
import { employeePortalService } from '@/services/employee-portal.service';
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
};

// ── Care Provider Hooks ───────────────────────────────────────────────────
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
    },
  });
};

export const useRejectRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => careProviderPortalService.rejectRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider'] });
    },
  });
};

export const useAssignEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, employeeId }: { requestId: string; employeeId: string }) =>
      careProviderPortalService.assignEmployee(requestId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider'] });
      queryClient.invalidateQueries({ queryKey: ['employee'] });
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
      queryClient.invalidateQueries({ queryKey: ['employee'] });
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
