import { create } from 'zustand';
import type { Emergency } from '@/types';

type EmergencyState = {
  emergencies: Emergency[];
  activeEmergency: Emergency | null;
  isLoading: boolean;
  error: string | null;
};

type EmergencyActions = {
  setEmergencies: (emergencies: Emergency[]) => void;
  setActiveEmergency: (emergency: Emergency | null) => void;
  addEmergency: (emergency: Emergency) => void;
  updateEmergency: (id: string, patch: Partial<Emergency>) => void;
  removeEmergency: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type EmergencyStore = EmergencyState & EmergencyActions;

const initialState: EmergencyState = {
  emergencies: [],
  activeEmergency: null,
  isLoading: false,
  error: null,
};

export const useEmergencyStore = create<EmergencyStore>((set) => ({
  ...initialState,
  setEmergencies: (emergencies) => set({ emergencies }),
  setActiveEmergency: (activeEmergency) => set({ activeEmergency }),
  addEmergency: (emergency) =>
    set((s) => ({ emergencies: [emergency, ...s.emergencies] })),
  updateEmergency: (id, patch) =>
    set((s) => ({
      emergencies: s.emergencies.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      activeEmergency:
        s.activeEmergency?.id === id ? { ...s.activeEmergency, ...patch } : s.activeEmergency,
    })),
  removeEmergency: (id) =>
    set((s) => ({
      emergencies: s.emergencies.filter((e) => e.id !== id),
      activeEmergency: s.activeEmergency?.id === id ? null : s.activeEmergency,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useEmergencyStore;
