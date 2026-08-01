import { create } from 'zustand';
import type { EmergencySession, EmergencyWorkflowStep } from '@/types';

type EmergencyState = {
  activeSession: EmergencySession | null;
  history: EmergencySession[];
  isConfirmationOpen: boolean;
  isLoading: boolean;
  error: string | null;
};

type EmergencyActions = {
  setActiveSession: (session: EmergencySession | null) => void;
  setHistory: (history: EmergencySession[]) => void;
  setConfirmationOpen: (open: boolean) => void;
  advanceSessionStep: () => void;
  resolveActiveSession: () => void;
  cancelActiveSession: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export type EmergencyStore = EmergencyState & EmergencyActions;

const initialSession: EmergencySession = {
  id: 'emg_active_1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  familyId: 'fam_1',
  memberId: 'mem_1',
  memberName: 'Madhav Rao',
  status: 'active',
  currentStepIndex: 0,
  notifiedContactsCount: 3,
  location: {
    line1: 'Marina Heights, Apt 1203',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    postalCode: '00000',
    lat: 25.0772,
    lng: 55.1332,
  },
  assignedProvider: {
    id: 'prov_1',
    name: 'Sunrise Home Care & Response',
    phone: '+971 4 333 1111',
    etaMinutes: 12,
  },
  assignedProfessional: {
    id: 'emp_prov_1',
    name: 'Kavya Menon',
    role: 'Senior Emergency Caregiver',
    phone: '+971 50 555 1212',
  },
  assignedAmbulance: {
    vehicleNumber: 'AMB-7892',
    driverName: 'Raghav Mehta',
    phone: '+971 50 888 9999',
    etaMinutes: 8,
  },
  notifiedHospital: {
    name: 'Dubai Healthcare City Hospital',
    phone: '+971 4 222 3333',
    address: 'Building 64, Healthcare City, Dubai',
  },
  trackingCoords: { lat: 25.0772, lng: 55.1332 },
  steps: [
    { step: 'sos_triggered', title: 'Emergency SOS Triggered', description: 'SOS signal sent from family portal', status: 'completed', completedAt: new Date().toISOString() },
    { step: 'location_detected', title: 'GPS Location Detected', description: 'Marina Heights, Apt 1203, Dubai (25.0772° N, 55.1332° E)', status: 'completed', completedAt: new Date().toISOString() },
    { step: 'coordinator_activated', title: 'AI Care Coordinator Activated', description: 'Analyzing emergency priority and medical profile', status: 'completed', completedAt: new Date().toISOString() },
    { step: 'provider_found', title: 'Nearest Service Provider Found', description: 'Sunrise Home Care & Response (2.4 km away)', status: 'completed', completedAt: new Date().toISOString() },
    { step: 'professional_assigned', title: 'Nearest Professional Assigned', description: 'Kavya Menon (Senior Emergency Caregiver)', status: 'completed', completedAt: new Date().toISOString() },
    { step: 'ambulance_assigned', title: 'Ambulance Partner Dispatched', description: 'Rapid Response Vehicle AMB-7892 dispatched', status: 'in-progress' },
    { step: 'hospital_notified', title: 'Hospital & Doctor Notified', description: 'Patient medical history transmitted to Dubai Healthcare City Hospital', status: 'pending' },
    { step: 'contacts_notified', title: 'Emergency Contacts Notified', description: 'SMS & Call fallback initiated to 3 family contacts', status: 'pending' },
    { step: 'live_updates', title: 'Live Location Tracking Active', description: 'Real-time GPS tracking shared with family', status: 'pending' },
    { step: 'resolved', title: 'Emergency Resolved', description: 'Responders arrived on scene & patient stabilized', status: 'pending' },
  ],
};

export const useEmergencyStore = create<EmergencyStore>((set) => ({
  activeSession: null,
  history: [],
  isConfirmationOpen: false,
  isLoading: false,
  error: null,
  setActiveSession: (activeSession) => set({ activeSession }),
  setHistory: (history) => set({ history }),
  setConfirmationOpen: (isConfirmationOpen) => set({ isConfirmationOpen }),
  advanceSessionStep: () =>
    set((s) => {
      if (!s.activeSession) return s;
      const nextIndex = Math.min(s.activeSession.currentStepIndex + 1, s.activeSession.steps.length - 1);
      const now = new Date().toISOString();
      const updatedSteps = s.activeSession.steps.map((st, i) => {
        if (i < nextIndex) return { ...st, status: 'completed' as const, completedAt: st.completedAt || now };
        if (i === nextIndex) return { ...st, status: 'in-progress' as const };
        return { ...st, status: 'pending' as const };
      });
      const isResolved = nextIndex === s.activeSession.steps.length - 1;
      const updatedSession: EmergencySession = {
        ...s.activeSession,
        currentStepIndex: nextIndex,
        steps: updatedSteps,
        status: isResolved ? 'resolved' : 'active',
        updatedAt: now,
      };
      return {
        activeSession: updatedSession,
        history: isResolved ? [updatedSession, ...s.history] : s.history,
      };
    }),
  resolveActiveSession: () =>
    set((s) => {
      if (!s.activeSession) return s;
      const now = new Date().toISOString();
      const resolvedSteps = s.activeSession.steps.map((st) => ({
        ...st,
        status: 'completed' as const,
        completedAt: st.completedAt || now,
      }));
      const resolved: EmergencySession = {
        ...s.activeSession,
        status: 'resolved',
        currentStepIndex: s.activeSession.steps.length - 1,
        steps: resolvedSteps,
        updatedAt: now,
      };
      return { activeSession: null, history: [resolved, ...s.history] };
    }),
  cancelActiveSession: () => set({ activeSession: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useEmergencyStore;
