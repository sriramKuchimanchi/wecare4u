import { create } from 'zustand';

type LiveActivityState = {
  isTrackingActive: boolean;
  activeActivityId: string | null;
  activityType: 'care-request' | 'emergency' | null;
  simulatedEtaMinutes: number;
  currentLat: number;
  currentLng: number;
};

type LiveActivityActions = {
  startTracking: (id: string, type: 'care-request' | 'emergency', etaMinutes?: number) => void;
  stopTracking: () => void;
  updateEta: (etaMinutes: number) => void;
  updateCoords: (lat: number, lng: number) => void;
};

export type LiveActivityStore = LiveActivityState & LiveActivityActions;

export const useLiveActivityStore = create<LiveActivityStore>((set) => ({
  isTrackingActive: false,
  activeActivityId: null,
  activityType: null,
  simulatedEtaMinutes: 15,
  currentLat: 25.0772,
  currentLng: 55.1332,
  startTracking: (id, type, etaMinutes = 15) =>
    set({
      isTrackingActive: true,
      activeActivityId: id,
      activityType: type,
      simulatedEtaMinutes: etaMinutes,
    }),
  stopTracking: () =>
    set({
      isTrackingActive: false,
      activeActivityId: null,
      activityType: null,
    }),
  updateEta: (simulatedEtaMinutes) => set({ simulatedEtaMinutes }),
  updateCoords: (currentLat, currentLng) => set({ currentLat, currentLng }),
}));

export default useLiveActivityStore;
