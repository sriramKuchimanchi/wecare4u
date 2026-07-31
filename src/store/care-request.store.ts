import { create } from 'zustand';
import type { CareRequest, CareRequestStatus } from '@/types';

type CareRequestState = {
  requests: CareRequest[];
  activeRequest: CareRequest | null;
  isLoading: boolean;
  error: string | null;
  // Wizard draft state
  wizardStep: number;
  draftCategory: string | null;
  draftProviderId: string | null;
  draftEmployeeId: string | null;
  draftMemberId: string | null;
  draftScheduledAt: string | null;
  draftNotes: string;
};

type CareRequestActions = {
  setRequests: (requests: CareRequest[]) => void;
  setActiveRequest: (request: CareRequest | null) => void;
  addRequest: (request: CareRequest) => void;
  updateRequestStatus: (id: string, status: CareRequestStatus, timelineStep?: { title: string; description?: string }) => void;
  setWizardStep: (step: number) => void;
  setDraftCategory: (category: string | null) => void;
  setDraftProviderId: (providerId: string | null) => void;
  setDraftEmployeeId: (employeeId: string | null) => void;
  setDraftMemberId: (memberId: string | null) => void;
  setDraftScheduledAt: (scheduledAt: string | null) => void;
  setDraftNotes: (notes: string) => void;
  resetWizard: () => void;
};

export type CareRequestStore = CareRequestState & CareRequestActions;

const initialState: CareRequestState = {
  requests: [],
  activeRequest: null,
  isLoading: false,
  error: null,
  wizardStep: 1,
  draftCategory: null,
  draftProviderId: null,
  draftEmployeeId: null,
  draftMemberId: null,
  draftScheduledAt: null,
  draftNotes: '',
};

export const useCareRequestStore = create<CareRequestStore>((set) => ({
  ...initialState,
  setRequests: (requests) => set({ requests }),
  setActiveRequest: (activeRequest) => set({ activeRequest }),
  addRequest: (request) => set((s) => ({ requests: [request, ...s.requests], activeRequest: request })),
  updateRequestStatus: (id, status, timelineStep) =>
    set((s) => {
      const now = new Date().toISOString();
      const updated = s.requests.map((r) => {
        if (r.id !== id) return r;
        const newTimeline = r.timeline ? [...r.timeline] : [];
        if (timelineStep) {
          newTimeline.push({
            status,
            title: timelineStep.title,
            description: timelineStep.description,
            timestamp: now,
          });
        }
        return { ...r, status, timeline: newTimeline, updatedAt: now };
      });
      const active = s.activeRequest?.id === id
        ? updated.find((r) => r.id === id) ?? s.activeRequest
        : s.activeRequest;
      return { requests: updated, activeRequest: active };
    }),
  setWizardStep: (wizardStep) => set({ wizardStep }),
  setDraftCategory: (draftCategory) => set({ draftCategory }),
  setDraftProviderId: (draftProviderId) => set({ draftProviderId }),
  setDraftEmployeeId: (draftEmployeeId) => set({ draftEmployeeId }),
  setDraftMemberId: (draftMemberId) => set({ draftMemberId }),
  setDraftScheduledAt: (draftScheduledAt) => set({ draftScheduledAt }),
  setDraftNotes: (draftNotes) => set({ draftNotes }),
  resetWizard: () =>
    set({
      wizardStep: 1,
      draftCategory: null,
      draftProviderId: null,
      draftEmployeeId: null,
      draftMemberId: null,
      draftScheduledAt: null,
      draftNotes: '',
    }),
}));

export default useCareRequestStore;
