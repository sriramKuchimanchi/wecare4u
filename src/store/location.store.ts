import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

export type UserLocation = {
  address: string;
  city: string;
  lat: number;
  lng: number;
};

type LocationState = {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
};

type LocationActions = {
  setLocation: (location: UserLocation) => void;
  refresh: () => Promise<UserLocation | null>;
};

export type LocationStore = LocationState & LocationActions;

// This is a demo app with no real geocoding API — resolving detected
// coordinates to a realistic, stable address for the current family
// reads much better in the UI than raw lat/lng.
const reverseGeocodeMock = (lat: number, lng: number): UserLocation => ({
  address: 'Gokuldham Heights, Flat 402',
  city: 'Mumbai',
  lat,
  lng,
});

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      location: null,
      isLoading: false,
      error: null,

      setLocation: (location) => set({ location, error: null }),

      refresh: async () => {
        set({ isLoading: true, error: null });

        if (!('geolocation' in navigator)) {
          const fallback = reverseGeocodeMock(19.076, 72.8777);
          set({ location: fallback, isLoading: false });
          return fallback;
        }

        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const resolved = reverseGeocodeMock(position.coords.latitude, position.coords.longitude);
              set({ location: resolved, isLoading: false });
              resolve(resolved);
            },
            () => {
              // Permission denied or unavailable — keep any previously known location.
              set({ isLoading: false, error: 'Location unavailable' });
              resolve(get().location);
            },
            { timeout: 8000 },
          );
        });
      },
    }),
    {
      name: STORAGE_KEYS.USER_LOCATION,
      partialize: (state) => ({ location: state.location }),
    },
  ),
);

export default useLocationStore;
