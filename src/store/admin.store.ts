import { create } from 'zustand';

export type AdminFilters = {
  search?: string;
  status?: string;
  verificationStatus?: string;
  type?: string;
  entityType?: string;
  priority?: string;
  isComplaint?: boolean;
  ownerType?: string;
  page?: number;
  pageSize?: number;
};

type AdminStoreState = {
  // Filters per module
  familyFilters: AdminFilters;
  providerFilters: AdminFilters;
  employeeFilters: AdminFilters;
  requestFilters: AdminFilters;
  emergencyFilters: AdminFilters;
  verificationFilters: AdminFilters;
  documentFilters: AdminFilters;
  reviewFilters: AdminFilters;
  notificationFilters: AdminFilters;
  timelineFilters: AdminFilters;

  // Global search
  globalSearchQuery: string;
  globalSearchOpen: boolean;

  // Active emergency IDs being monitored
  activeEmergencyIds: string[];

  // Selected items for bulk actions
  selectedProviderIds: string[];
  selectedEmployeeIds: string[];

  // Setters
  setFamilyFilters: (f: Partial<AdminFilters>) => void;
  setProviderFilters: (f: Partial<AdminFilters>) => void;
  setEmployeeFilters: (f: Partial<AdminFilters>) => void;
  setRequestFilters: (f: Partial<AdminFilters>) => void;
  setEmergencyFilters: (f: Partial<AdminFilters>) => void;
  setVerificationFilters: (f: Partial<AdminFilters>) => void;
  setDocumentFilters: (f: Partial<AdminFilters>) => void;
  setReviewFilters: (f: Partial<AdminFilters>) => void;
  setNotificationFilters: (f: Partial<AdminFilters>) => void;
  setTimelineFilters: (f: Partial<AdminFilters>) => void;

  setGlobalSearchQuery: (q: string) => void;
  setGlobalSearchOpen: (open: boolean) => void;

  addActiveEmergency: (id: string) => void;
  removeActiveEmergency: (id: string) => void;

  setSelectedProviderIds: (ids: string[]) => void;
  setSelectedEmployeeIds: (ids: string[]) => void;
  resetFilters: () => void;
};

const defaultFilters: AdminFilters = { page: 1, pageSize: 20 };

export const useAdminStore = create<AdminStoreState>((set) => ({
  familyFilters: { ...defaultFilters },
  providerFilters: { ...defaultFilters },
  employeeFilters: { ...defaultFilters },
  requestFilters: { ...defaultFilters },
  emergencyFilters: { ...defaultFilters },
  verificationFilters: { ...defaultFilters },
  documentFilters: { ...defaultFilters },
  reviewFilters: { ...defaultFilters },
  notificationFilters: { ...defaultFilters },
  timelineFilters: { ...defaultFilters },

  globalSearchQuery: '',
  globalSearchOpen: false,
  activeEmergencyIds: ['emer_1'],
  selectedProviderIds: [],
  selectedEmployeeIds: [],

  setFamilyFilters: (f) => set((s) => ({ familyFilters: { ...s.familyFilters, ...f } })),
  setProviderFilters: (f) => set((s) => ({ providerFilters: { ...s.providerFilters, ...f } })),
  setEmployeeFilters: (f) => set((s) => ({ employeeFilters: { ...s.employeeFilters, ...f } })),
  setRequestFilters: (f) => set((s) => ({ requestFilters: { ...s.requestFilters, ...f } })),
  setEmergencyFilters: (f) => set((s) => ({ emergencyFilters: { ...s.emergencyFilters, ...f } })),
  setVerificationFilters: (f) => set((s) => ({ verificationFilters: { ...s.verificationFilters, ...f } })),
  setDocumentFilters: (f) => set((s) => ({ documentFilters: { ...s.documentFilters, ...f } })),
  setReviewFilters: (f) => set((s) => ({ reviewFilters: { ...s.reviewFilters, ...f } })),
  setNotificationFilters: (f) => set((s) => ({ notificationFilters: { ...s.notificationFilters, ...f } })),
  setTimelineFilters: (f) => set((s) => ({ timelineFilters: { ...s.timelineFilters, ...f } })),

  setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),

  addActiveEmergency: (id) =>
    set((s) => ({ activeEmergencyIds: [...new Set([...s.activeEmergencyIds, id])] })),
  removeActiveEmergency: (id) =>
    set((s) => ({ activeEmergencyIds: s.activeEmergencyIds.filter((i) => i !== id) })),

  setSelectedProviderIds: (ids) => set({ selectedProviderIds: ids }),
  setSelectedEmployeeIds: (ids) => set({ selectedEmployeeIds: ids }),

  resetFilters: () =>
    set({
      familyFilters: { ...defaultFilters },
      providerFilters: { ...defaultFilters },
      employeeFilters: { ...defaultFilters },
      requestFilters: { ...defaultFilters },
      emergencyFilters: { ...defaultFilters },
      verificationFilters: { ...defaultFilters },
      documentFilters: { ...defaultFilters },
      reviewFilters: { ...defaultFilters },
      notificationFilters: { ...defaultFilters },
      timelineFilters: { ...defaultFilters },
    }),
}));

export default useAdminStore;
